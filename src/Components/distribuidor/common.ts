import { db, dbUpdate } from 'Firebase';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';
import slugify from 'slugify';

export const DuplicateErrorMessage = 'nombre duplicado';
export const MissingNombreMessage = 'falta nombre';

export const distrRef = (idDistribuidor?: string) =>
  db.ref(`distribuidores/${idDistribuidor}`);

export const useDistribuidor = (idDistribuidor: ID) =>
  useObjectVal<DistribuidorType>(distrRef(idDistribuidor));

export const useDistribuidores = () =>
  useListVals<DistribuidorType>(
    db.ref('distribuidores').orderByChild('nombre'),
    { keyField: 'idDistribuidor' }
  );

export const createDistribuidor: (
  values: Partial<DistribuidorType>
) => Promise<ID> = async (values) => {
  if (values.nombre) {
    var slug = slugify(values.nombre, { lower: true });
    const duplicate = await distrRef(slug).once('value');
    if (duplicate.exists()) {
      throw new Error(DuplicateErrorMessage);
    } else {
      await distrRef(slug).set(values);
      return slug;
    }
  } else {
    throw new Error(MissingNombreMessage);
  }
};

export const updateDistribuidor: <U extends Partial<DistribuidorType>>(
  idDistribuidor: string,
  newValues: U,
  origValues: U
) => Promise<any> = (idVenta, newValues, origValues) =>
  dbUpdate(
    `distribuidores/${idVenta}`,
    newValues,
    origValues,
    (name, value) => value
  );

export const deleteDistribuidor: (idDistribuidor: ID) => Promise<any> = (
  idDistribuidor
) => distrRef(idDistribuidor).remove();
