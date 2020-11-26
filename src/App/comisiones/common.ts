import { dbTable } from 'Firebase';

const { useItem, useList, dbCreate, dbDelete, dbUpdate } = dbTable<
  ComisionType,
  Omit<ComisionType, 'fecha'> & { fecha: string }
>(
  'comisiones',
  'idComision',
  (comision) => ({
    ...comision,
    fecha: new Date(comision?.fecha),
  }),
  (comision) => ({
    ...comision,
    fecha: comision.fecha?.toISOString(),
  })
);

export const useComision = useItem;
export const useComisiones = () => useList('fecha');
export const createComision = dbCreate;
export const updateComision = dbUpdate;
export const deleteComision = dbDelete;
