import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

import config from './firebase.config';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';
import memoize from 'memoize-one';

firebase.initializeApp(config);

export default firebase;

export const db = firebase.database();

export const auth = firebase.auth();
auth.useDeviceLanguage();

export const login = () => {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
};
export const logout = () => {
  auth.signOut();
};

export const CLAVE_DUPLICADA = 'Clave Duplicada';
export const FALTA_ORDER_BY = 'Para usar equalTo debe especificarse orderBy';
export const CONFLICTO_EN_UPDATE = 'Actualización cruzada en update';

export class DbError<F> extends Error {
  path: string;
  operation: string;
  field?: F;
  value?: any;
  constructor(
    message: string,
    path: string,
    operation: string,
    field?: F,
    value?: any
  ) {
    super(message);
    this.path = path;
    this.operation = operation;
    this.field = field;
    this.value = value;
    this.name = 'DbError';
  }
  toString() {
    return `${super.toString()} 
    on: [${this.path}] when doing: ${this.operation}
    field: [${this.field}]
    value: [${this.value.toString()}]`;
  }
}
export const dbTable = <
  ItemType extends Record<string, any>,
  DbType extends Record<string, any>
>(
  path: string,
  keyField: string,
  fromDb: (item: DbType) => ItemType = (item) => item as ItemType,
  toDb: (item: Partial<ItemType>) => Partial<DbType> = (item) => item as DbType
): {
  useItem: (id: ID) => [ItemType | undefined, boolean, any];
  useList: (
    sortField?: string,
    equalTo?: any
  ) => [ItemType[] | undefined, boolean, any];
  dbCreate: (newValues: Partial<ItemType>) => Promise<ID>;
  dbCreateWithKey: (id: ID, newValues: Partial<ItemType>) => Promise<void>;
  /**
   *
   * @param path Path to the record to be updated
   * @param newValues Record containing the values to be updated
   * @param origValues Record containing the original values for this record
   * @param transform Function that will be called multiple times,
   * with the name of the field, and the value of that field
   * to be transformed from the type used internally in the application
   * to the type as stored in the database
   * (for example, a date to a string representation of it.)
   */
  dbUpdate: (
    id: ID,
    newValues: Partial<ItemType>,
    originalValues: ItemType
  ) => Promise<ItemType>;
  dbDelete: (id: ID) => Promise<void>;
} => {
  const memoizedItem = memoize(
    (item: DbType | undefined) => item && fromDb(item)
  );

  const memoizedList = memoize((list: DbType[]) => list.map(fromDb));

  const itemRef = (id: string) => db.ref(`${path}/${id}`);
  return {
    useItem: (id) => {
      const [item, loading, error] = useObjectVal<DbType>(itemRef(id));

      if (loading || error || typeof item === 'undefined')
        return [undefined, loading, error];
      return [memoizedItem(item), loading, error];
    },
    useList: (sortField, equalTo) => {
      if (typeof equalTo !== 'undefined' && typeof sortField === 'undefined')
        throw new DbError<keyof ItemType>(
          FALTA_ORDER_BY,
          path,
          'useList',
          sortField
        );
      let ref: firebase.database.Query = db.ref(path);
      if (sortField) ref = ref.orderByChild(sortField);
      if (equalTo) ref = ref.equalTo(equalTo);
      const [list, loading, error] = useListVals<DbType>(ref, { keyField });

      if (loading || error) return [undefined, loading, error];
      if (typeof list === 'undefined')
        return [list, loading, new Error('La tabla está vacía')];
      return [memoizedList(list), loading, error];
    },
    dbCreate: async (newValues) => {
      const outRef = await db.ref(path).push(toDb(newValues));
      return outRef.key || '';
    },
    dbCreateWithKey: async (id, newValues) => {
      const ref = itemRef(id);
      const duplicate = await ref.once('value');
      if (duplicate.exists()) {
        throw new DbError<keyof ItemType>(
          CLAVE_DUPLICADA,
          path,
          'dbCreateWithKey',
          keyField,
          id
        );
      } else {
        await ref.set(toDb(newValues));
      }
    },
    dbUpdate: (id, newValues, originalValues) =>
      itemRef(id).transaction((dbValues) => {
        const updatedValues = toDb(newValues);
        const orgValues = toDb(originalValues);
        const dirtyFields = Object.keys(updatedValues).filter((name) =>
          name === keyField ? false : updatedValues[name] !== orgValues[name]
        );
        dirtyFields.forEach((name) => {
          if (dbValues[name] !== orgValues[name])
            throw new DbError<keyof ItemType>(
              CONFLICTO_EN_UPDATE,
              path,
              'dbUpdate',
              name,
              dbValues[name]
            );
        });
        return Object.assign(dbValues, updatedValues);
      }),
    dbDelete: (id) => itemRef(id).remove(),
  };
};
