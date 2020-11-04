import { db } from 'Firebase';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';

export const distrRef = (idDistribuidor?: string) =>
  db.ref(`distribuidores/${idDistribuidor}`);

export const useDistribuidor = (idDistribuidor: ID) =>
  useObjectVal<DistribuidorType>(distrRef(idDistribuidor));

export const useDistribuidores = () =>
  useListVals<DistribuidorType>(
    db.ref('distribuidores').orderByChild('nombre')
  );
