import { db, dbUpdate } from 'Firebase';
import firebase from 'firebase';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';

export const ventaRef = (idVendedor: ID) => db.ref(`vendedores/${idVendedor}`);

export const useVendedor = (idVendedor: ID) =>
  useObjectVal<VendedorType>(ventaRef(idVendedor));

export const useVendedores = () =>
  useListVals<VendedorType>(db.ref('vendedores').orderByChild('fecha'), {
    keyField: 'idVendedor',
  });

export const createVendedor: (
  values: Partial<VendedorType>
) => firebase.database.ThenableReference = (values) =>
  db.ref('vendedores').push(values);

export const updateVendedor: <U extends Partial<VendedorType>>(
  idVendedor: string,
  newValues: U,
  origValues: U
) => Promise<any> = (idVendedor, newValues, origValues) =>
  dbUpdate(
    `vendedores/${idVendedor}`,
    newValues,
    origValues,
    (name, value) => value
  );

export const deleteVendedor: (idVendedor: ID) => Promise<any> = (idVendedor) =>
  ventaRef(idVendedor).remove();
