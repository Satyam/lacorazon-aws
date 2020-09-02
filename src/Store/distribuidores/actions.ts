import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export const loadDistribuidores = createAsyncThunk<Array<DistribuidorType>>(
  'loadDistribuidores',
  async (_, { requestId }) =>
    import('./data').then((data) => data.distribuidores)
);

export const createDistribuidor = createAsyncThunk<
  DistribuidorType,
  DistribuidorType
>(
  'createDistribuidor',
  async (distribuidor, { requestId }) =>
    await { ...distribuidor, idDistribuidor: uuid() }
);

export const updateDistribuidor = createAsyncThunk<
  Partial<DistribuidorType>,
  Partial<DistribuidorType>
>(
  'updateDistribuidor',
  async (distribuidor, { requestId }) => await distribuidor
);

export const deleteDistribuidor = createAsyncThunk<ID, ID>(
  'deleteDistribuidor',
  async (idDistribuidor, { requestId }) => await idDistribuidor
);
