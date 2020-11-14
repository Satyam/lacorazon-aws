import { db } from 'Firebase';
import memoize from 'memoize-one';
import { useListVals } from 'react-firebase-hooks/database';

const memoizedVentas = memoize((salidas: SalidaType[]): SalidaType[] =>
  salidas?.map<SalidaType>((salida) => ({
    ...salida,
    fecha: new Date(salida.fecha),
  }))
);

export const useSalidas: () => [
  Array<SalidaType> | undefined,
  boolean,
  any
] = () => {
  const [salidas, loading, error] = useListVals<SalidaType>(
    db.ref('salidas').orderByChild('fecha'),
    { keyField: 'idSalida' }
  );
  if (loading || error) return [undefined, loading, error];
  if (typeof salidas === 'undefined')
    return [salidas, loading, new Error('Tabla salidas está vacía')];
  return [memoizedVentas(salidas), loading, error];
};
