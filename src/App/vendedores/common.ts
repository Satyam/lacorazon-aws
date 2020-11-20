import { dbTable } from 'Firebase';
import slugify from 'slugify';

export { CLAVE_DUPLICADA } from 'Firebase';

export const FALTA_NOMBRE = 'Falta nombre';

const { useItem, useList, dbCreateWithKey, dbDelete, dbUpdate } = dbTable<
  VendedorType,
  VendedorType
>('vendedores', 'idVendedor');

export const useVendedor = useItem;

export const useVendedores = () => useList('nombre');

export const createVendedor = async (
  values: Partial<VendedorType>
): Promise<ID> => {
  if (values.nombre) {
    const idVendedor = slugify(values.nombre, { lower: true });
    await dbCreateWithKey(idVendedor, values);
    return idVendedor;
  } else {
    throw new Error(FALTA_NOMBRE);
  }
};

export const updateVendedor = dbUpdate;

export const deleteVendedor = dbDelete;
