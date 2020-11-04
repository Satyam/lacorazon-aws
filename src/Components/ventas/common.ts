import { useMemo } from 'react';
import { db } from 'Firebase';
import { useObjectVal, useList } from 'react-firebase-hooks/database';

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

export const useVentas = () => {
  const [ventasSnap, loading, error] = useList(db.ref('ventas'));
  return [
    ventasSnap?.map((ventaSnap) => {
      const vals: VentaType = ventaSnap.val();
      return {
        ...vals,
        idVenta: ventaSnap.key,
        fecha: new Date(vals.fecha),
      };
    }),
    loading,
    error,
  ];
};
