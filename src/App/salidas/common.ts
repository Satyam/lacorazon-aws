import { db } from 'Firebase';
import { useListVals } from 'react-firebase-hooks/database';

export const useSalidas: () => [
  Array<SalidaType> | undefined,
  boolean,
  any
] = () => {
  const [salidas, loading, error] = useListVals<SalidaType>(
    db.ref('salidas').orderByChild('fecha'),
    { keyField: 'idSalida' }
  );
  return [
    salidas?.map<SalidaType & { fecha: Date }>((salida) => ({
      ...salida,
      fecha: new Date(salida.fecha),
    })),
    loading,
    error,
  ];
};
