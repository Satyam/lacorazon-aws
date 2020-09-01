import { createAsyncThunk } from '@reduxjs/toolkit';
export const listDistribuidores = createAsyncThunk<Array<DistribuidorType>>(
  'listDistribuidores',
  async (_, { requestId }) =>
    import('./data').then((data) => data.distribuidores)
);

export const deleteDistribuidor = createAsyncThunk<ID, ID>(
  'deleteDistribuidor',
  async (idDistribuidor, { requestId }) => await idDistribuidor
);
