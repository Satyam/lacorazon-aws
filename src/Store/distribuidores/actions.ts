import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import type { RootState } from 'Store';

import { selDistribuidores } from './selectors';

export const loadDistribuidores = createAsyncThunk<Array<DistribuidorType>>(
  'loadDistribuidores',
  () => import('./data').then((data) => data.distribuidores)
);

export const createDistribuidor = createAsyncThunk<
  DistribuidorType,
  DistribuidorType
>('createDistribuidor', (distribuidor, { getState }) => {
  const { distribuidores } = selDistribuidores(getState() as RootState);
  if (
    distribuidores.find(
      (d: DistribuidorType) => d.nombre === distribuidor.nombre
    )
  ) {
    // eslint-disable-next-line no-throw-literal
    throw {
      name: 'DuplicateError',
      message: 'nombre',
    };
  }
  return {
    ...distribuidor,
    idDistribuidor: uuid(),
  };
});

export const updateDistribuidor = createAsyncThunk<
  Partial<DistribuidorType>,
  Partial<DistribuidorType>
>('updateDistribuidor', (distribuidor, { getState }) => {
  const { distribuidores } = selDistribuidores(getState() as RootState);
  if (
    distribuidores.find(
      (d: DistribuidorType) =>
        d.nombre === distribuidor.nombre &&
        d.idDistribuidor !== distribuidor.idDistribuidor
    )
  ) {
    // eslint-disable-next-line no-throw-literal
    throw {
      name: 'DuplicateError',
      message: 'nombre',
    };
  }
  return distribuidor;
});

export const deleteDistribuidor = createAsyncThunk<ID, ID>(
  'deleteDistribuidor',
  (idDistribuidor) => idDistribuidor
);
