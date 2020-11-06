import { useMemo } from 'react';
import { db } from 'Firebase';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';

export const ventaRef = (idVenta: ID) => db.ref(`ventas/${idVenta}`);

export const useVenta = (idVenta: ID) => {
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
