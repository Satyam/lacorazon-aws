import { dbTable } from 'Firebase';

const { useItem, useList, dbCreate, dbDelete, dbUpdate } = dbTable<
  FacturacionType,
  Omit<FacturacionType, 'fecha'> & { fecha: string }
>(
  'facturas',
  'idFacturacion',
  (facturacion) => ({
    ...facturacion,
    fecha: new Date(facturacion?.fecha),
  }),
  (facturacion) => ({
    ...facturacion,
    fecha: facturacion.fecha?.toISOString(),
  })
);

export const useFacturacion = useItem;
export const useFacturaciones = () => useList('fecha');
export const createFacturacion = dbCreate;
export const updateFacturacion = dbUpdate;
export const deleteFacturacion = dbDelete;
