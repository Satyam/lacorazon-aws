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
  DistribuidorType,
  any
>(
  'createDistribuidor',
  (distribuidor) => ({
    ...distribuidor,
    idDistribuidor: uuid(),
  }),
  {
    condition: (distribuidor, { getState }) => {
      const { distribuidores } = selDistribuidores(getState() as RootState);
      if (
        distribuidores.find(
          (d: DistribuidorType) => d.nombre === distribuidor.nombre
        )
      )
        return false;
      return true;
    },
  }
);

export const updateDistribuidor = createAsyncThunk<
  Partial<DistribuidorType>,
  Partial<DistribuidorType>
>('updateDistribuidor', (distribuidor) => distribuidor, {
  condition: (distribuidor, { getState }) => {
    const { distribuidores } = selDistribuidores(getState() as RootState);
    if (
      distribuidores.find(
        (d: DistribuidorType) => d.nombre === distribuidor.nombre
      )
    )
      return false;
    return true;
  },
});

export const deleteDistribuidor = createAsyncThunk<ID, ID>(
  'deleteDistribuidor',
  (idDistribuidor) => idDistribuidor
);
