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
  useList: (sortField?: string) => [ItemType[] | undefined, boolean, any];
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
    useList: (sortField) => {
      const [list, loading, error] = useListVals<DbType>(
        sortField ? db.ref(path).orderByChild(sortField) : db.ref(path),
        { keyField }
      );

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
        throw new Error(CLAVE_DUPLICADA);
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
        if (dirtyFields.some((name) => dbValues[name] !== orgValues[name])) {
          return;
        }
        return Object.assign(dbValues, updatedValues);
      }),
    dbDelete: (id) => itemRef(id).remove(),
  };
};
