import { dbTable } from 'Firebase';

const { useItem, useList, dbCreate, dbDelete, dbUpdate } = dbTable<
  GastoType,
  Omit<GastoType, 'fecha'> & { fecha: string }
>(
  'gastos',
  'idGasto',
  (gasto) => ({
    ...gasto,
    fecha: new Date(gasto?.fecha),
  }),
  (gasto) => ({
    ...gasto,
    fecha: gasto.fecha?.toISOString(),
  })
);

export const useGasto = useItem;

export const useGastos = () => useList('fecha');

export const createGasto = dbCreate;

export const updateGasto = dbUpdate;

export const deleteGasto = dbDelete;
