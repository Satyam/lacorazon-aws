import { db } from 'Firebase';
import { useListVals } from 'react-firebase-hooks/database';

export const useConsignas: () => [
  Array<ConsignaType> | undefined,
  boolean,
  any
] = () => {
  const [consignas, loading, error] = useListVals<ConsignaType>(
    db.ref('consigna').orderByChild('fecha'),
    { keyField: 'idConsigna' }
  );
  return [
    consignas?.map<ConsignaType & { fecha: Date }>((consigna) => ({
      ...consigna,
      fecha: new Date(consigna.fecha),
    })),
    loading,
    error,
  ];
};
