import { db, dbUpdate } from 'Firebase';
import firebase from 'firebase';
import memoize from 'memoize-one';
import { useListVals, useObjectVal } from 'react-firebase-hooks/database';

export const GASTO = 'gasto';
export const REINTEGRO = 'reintegro';
export const PAGO_IVA = 'pagoIva';
export const COMISION = 'comision';

type InputType = SalidaType & { fecha: string };

const transform: (input: InputType) => SalidaType = ({ fecha, ...rest }) => ({
  ...rest,
  fecha: new Date(fecha),
});

const memoizedSalidas = memoize((salidas: InputType[]): SalidaType[] =>
  salidas?.map(transform)
);

const memoizedSalida = memoize(
  (salida: InputType): SalidaType => salida && transform(salida)
);

const salidaRef = (idSalida: ID) => db.ref(`salidas/${idSalida}`);

export const useSalidas: () => [
  Array<SalidaType> | undefined,
  boolean,
  any
] = () => {
  const [salidas, loading, error] = useListVals<InputType>(
    db.ref('salidas').orderByChild('fecha'),
    { keyField: 'idSalida' }
  );
  if (loading || error) return [undefined, loading, error];
  if (typeof salidas === 'undefined')
    return [salidas, loading, new Error('Tabla salidas está vacía')];
  return [memoizedSalidas(salidas), loading, error];
};

export const useSalida: (
  idSalida: ID
) => [SalidaType | undefined, boolean, any] = (idSalida) => {
  const [salida, loading, error] = useObjectVal<InputType>(
    salidaRef(idSalida),
    { keyField: 'idSalida' }
  );
  if (loading || error || typeof salida === 'undefined')
    return [undefined, loading, error];
  return [memoizedSalida(salida), loading, error];
};

export const createSalida: (
  values: Partial<SalidaType>
) => firebase.database.ThenableReference = (values) =>
  db.ref('salidas').push({
    ...values,
    fecha: values.fecha?.toISOString(),
  });

export const updateSalida: <U extends Partial<SalidaType>>(
  idSalida: string,
  newValues: U,
  origValues: U
) => Promise<any> = (idSalida, newValues, origValues) =>
  dbUpdate(`salidas/${idSalida}`, newValues, origValues, (name, value) =>
    name === 'fecha' ? value.toISOString() : value
  );

export const deleteSalida: (idSalida: ID) => Promise<any> = (idSalida) =>
  salidaRef(idSalida).remove();
