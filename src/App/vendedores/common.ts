import { dbTable } from 'Firebase';

export { CLAVE_DUPLICADA, DbError } from 'Firebase';

export const FALTA_NOMBRE = 'Falta nombre';

const { useItem, useList, dbCreateWithKey, dbDelete, dbUpdate } = dbTable<
  VendedorType,
  VendedorType
>('vendedores', 'idVendedor');

export const useVendedor = useItem;

export const useVendedores = (sortField?: string, equalTo?: any) =>
  useList(sortField || 'nombre', equalTo);

export const createVendedor = async ({
  idVendedor,
  nombre,
  email,
}: VendedorType): Promise<ID> => {
  if (nombre) {
    await dbCreateWithKey(idVendedor, { nombre, email });
    return idVendedor;
  } else {
    throw new Error(FALTA_NOMBRE);
  }
};

export const updateVendedor = dbUpdate;

export const deleteVendedor = dbDelete;
