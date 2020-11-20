import { dbTable } from 'Firebase';

const { useItem, useList, dbCreate, dbDelete, dbUpdate } = dbTable<
  SalidaType,
  Omit<SalidaType, 'fecha'> & { fecha: string }
>(
  'salidas',
  'idSalida',
  (salida) => ({
    ...salida,
    fecha: new Date(salida?.fecha),
  }),
  (salida) => ({
    ...salida,
    fecha: salida.fecha?.toISOString(),
  })
);

export const GASTO = 'gasto';
export const REINTEGRO = 'reintegro';
export const PAGO_IVA = 'pagoIva';
export const COMISION = 'comision';

export const useSalida = useItem;

export const useSalidas = () => useList('fecha');

export const createSalida = dbCreate;

export const updateSalida = dbUpdate;

export const deleteSalida = dbDelete;
