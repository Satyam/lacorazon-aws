import { db } from 'Firebase';
import memoize from 'memoize-one';

import { useListVals } from 'react-firebase-hooks/database';

const memoizedConsignas = memoize((consignas: ConsignaType[]): ConsignaType[] =>
  consignas.map<ConsignaType>((consigna) => ({
    ...consigna,
    fecha: new Date(consigna.fecha),
  }))
);
export const useConsignas: () => [
  Array<ConsignaType> | undefined,
  boolean,
  any
] = () => {
  const [consignas, loading, error] = useListVals<ConsignaType>(
    db.ref('consigna').orderByChild('fecha'),
    { keyField: 'idConsigna' }
  );
  if (loading || error) return [undefined, loading, error];
  if (typeof consignas === 'undefined')
    return [consignas, loading, new Error('Tabla consignas está vacía')];
  return [memoizedConsignas(consignas), loading, error];
};
