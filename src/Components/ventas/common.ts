import { useMemo } from 'react';
import { db, dbUpdate } from 'Firebase';
import firebase from 'firebase';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';

export const ventaRef = (idVenta: ID) => db.ref(`ventas/${idVenta}`);

export const useVenta: (
  idVenta: ID
) => [VentaType | undefined, boolean, any] = (idVenta) => {
  const [venta, loading, error] = useObjectVal<VentaType>(ventaRef(idVenta));
  return useMemo(
    () => [
      venta
        ? {
            ...venta,
            fecha: new Date(venta?.fecha),
            idVenta,
          }
        : venta,
      loading,
      error,
    ],
    [idVenta, venta, loading, error]
  );
};

export const useVentas: () => [
  Array<VentaType> | undefined,
  boolean,
  any
] = () => {
  const [ventas, loading, error] = useListVals<VentaType>(
    db.ref('ventas').orderByChild('fecha'),
    { keyField: 'idVenta' }
  );
  return [
    ventas?.map<VentaType & { fecha: Date }>((venta) => ({
      ...venta,
      fecha: new Date(venta.fecha),
    })),
    loading,
    error,
  ];
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
