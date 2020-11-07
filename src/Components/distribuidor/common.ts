import { db, dbUpdate } from 'Firebase';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';

export const distrRef = (idDistribuidor?: string) =>
  db.ref(`distribuidores/${idDistribuidor}`);

export const useDistribuidor = (idDistribuidor: ID) =>
  useObjectVal<DistribuidorType>(distrRef(idDistribuidor));

export const useDistribuidores = () =>
  useListVals<DistribuidorType>(
    db.ref('distribuidores').orderByChild('nombre')
  );

export const updateDistribuidor: <U extends Partial<DistribuidorType>>(
  idDistribuidor: string,
  newValues: U,
  origValues: U
) => Promise<any> = (idVenta, newValues, origValues) =>
  dbUpdate(
    `distribuidores/${idVenta}`,
    newValues,
    origValues,
    (name, value) => value
  );
