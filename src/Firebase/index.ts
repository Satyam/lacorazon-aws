import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

import config from './firebase.config';

firebase.initializeApp(config);

export default firebase;

export const db = firebase.database();

export const auth = firebase.auth();
auth.useDeviceLanguage();

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
export const dbUpdate: <U extends Record<string, any>>(
  path: string,
  newValues: U,
  origValues: U,
  transform: (name: string, fieldValue: any) => U
) => Promise<any> = async (path, newValues, origValues, transform) => {
  return await db.ref(path).transaction((dbValues) => {
    const dirtyFields = Object.keys(newValues).filter(
      (name) => newValues[name] !== origValues[name]
    );
    if (
      dirtyFields.some(
        (name: string) => dbValues[name] !== transform(name, origValues[name])
      )
    ) {
      return;
    }
    return dirtyFields.reduce(
      (updatedValues, name) => ({
        ...updatedValues,
        [name]: transform(name, newValues[name]),
      }),
      dbValues
    );
  });
};
