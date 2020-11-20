import { dbTable } from 'Firebase';

const { useItem, useList, dbCreate, dbDelete, dbUpdate } = dbTable<
  VentaType,
  Omit<VentaType, 'fecha'> & { fecha: string }
>(
  'ventas',
  'idVenta',
  (venta) => ({
    ...venta,
    fecha: new Date(venta?.fecha),
    precioUnitario: venta.precioUnitario || 0,
  }),
  (venta) => ({
    ...venta,
    fecha: venta.fecha?.toISOString(),
  })
);

export const useVenta = useItem;

export const useVentas = () => useList('fecha');

export const createVenta = dbCreate;

export const updateVenta = dbUpdate;

export const deleteVenta = dbDelete;
