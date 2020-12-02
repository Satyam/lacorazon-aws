import { dbTable } from 'Firebase';
import slugify from 'slugify';

export { CLAVE_DUPLICADA, DbError } from 'Firebase';

export const FALTA_NOMBRE = 'Falta nombre';

const { useItem, useList, dbCreateWithKey, dbDelete, dbUpdate } = dbTable<
  DistribuidorType,
  DistribuidorType
>('distribuidores', 'idDistribuidor');

export const useDistribuidor = useItem;

export const useDistribuidores = () => useList('nombre');

export const createDistribuidor = async (
  values: Partial<DistribuidorType>
): Promise<ID> => {
  if (values.nombre) {
    const idDistribuidor = slugify(values.nombre, { lower: true });
    await dbCreateWithKey(idDistribuidor, values);
    return idDistribuidor;
  } else {
    throw new Error(FALTA_NOMBRE);
  }
};

export const updateDistribuidor = dbUpdate;

export const deleteDistribuidor = dbDelete;
