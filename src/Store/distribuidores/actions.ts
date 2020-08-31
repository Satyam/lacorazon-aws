import { createAsyncThunk } from '@reduxjs/toolkit';
import { selDistribuidorData } from './selectors';
export const listDistribuidores = createAsyncThunk<Array<DistribuidorType>>(
  'listDistribuidores',
  async (_, { requestId }) =>
    import('./data').then((data) => data.distribuidores)
);

// export const deleteDistribuidor = createAsyncThunk<DistribuidorType, ID>(
//   'deleteDistribuidor',
//   async (idDistribuidor, { requestId, getState }) =>
//     await selDistribuidorData(getState(), idDistribuidor)
// );
