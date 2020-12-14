import { dbTable } from 'Firebase';

const { useItem, useList, dbCreate, dbDelete, dbUpdate } = dbTable<
  ConsignaType,
  Omit<ConsignaType, 'fecha'> & { fecha: string }
>(
  'consigna',
  'idConsigna',
  (consigna) => ({
    ...consigna,
    fecha: new Date(consigna?.fecha),
  }),
  (consigna) => ({
    ...consigna,
    fecha: consigna.fecha?.toISOString(),
  })
);

export const useConsigna = useItem;
export const useConsignas = (sortField?: string, equalTo?: any) =>
  useList(sortField || 'fecha', equalTo);
export const createConsigna = dbCreate;
export const updateConsigna = dbUpdate;
export const deleteConsigna = dbDelete;
