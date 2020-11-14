import memoize from 'memoize-one';
import { db, dbUpdate } from 'Firebase';
import firebase from 'firebase';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';

export const ventaRef = (idVenta: ID) => db.ref(`ventas/${idVenta}`);

const memoizedVenta = memoize(
  (venta: VentaType): VentaType => ({
    ...venta,
    fecha: new Date(venta?.fecha),
  })
);

export const useVenta: (
  idVenta: ID
) => [VentaType | undefined, boolean, any] = (idVenta) => {
  const [venta, loading, error] = useObjectVal<VentaType>(ventaRef(idVenta));

  if (loading || error || typeof venta === 'undefined')
    return [undefined, loading, error];
  return [memoizedVenta(venta), loading, error];
};

const memoizedVentas = memoize((ventas: VentaType[]): VentaType[] =>
  ventas.map<VentaType>((venta) => ({
    ...venta,
    fecha: new Date(venta.fecha),
  }))
);

export const useVentas: () => [
  Array<VentaType> | undefined,
  boolean,
  any
] = () => {
  const [ventas, loading, error] = useListVals<VentaType>(
    db.ref('ventas').orderByChild('fecha'),
    { keyField: 'idVenta' }
  );

  if (loading || error) return [undefined, loading, error];
  if (typeof ventas === 'undefined')
    return [ventas, loading, new Error('Tabla ventas está vacía')];
  return [memoizedVentas(ventas), loading, error];
};

export const createVenta: (
  values: Partial<VentaType>
) => firebase.database.ThenableReference = (values) =>
  db.ref('ventas').push({
    ...values,
    fecha: values.fecha?.toISOString(),
  });

export const updateVenta: <U extends Partial<VentaType>>(
  idVenta: string,
  newValues: U,
  origValues: U
) => Promise<any> = (idVenta, newValues, origValues) =>
  dbUpdate(`ventas/${idVenta}`, newValues, origValues, (name, value) =>
    name === 'fecha' ? value.toISOString() : value
  );

export const deleteVenta: (idVenta: ID) => Promise<any> = (idVenta) =>
  ventaRef(idVenta).remove();
