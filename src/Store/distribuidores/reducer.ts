import { createReducer, SerializedError } from '@reduxjs/toolkit';
import { IDLE, LOADING, LOADED, ThunkActionState } from 'Store/constants';
import adapter from './adapter';

import {
  loadDistribuidores,
  createDistribuidor,
  updateDistribuidor,
  deleteDistribuidor,
} from './actions';

const setLoading = (state: ThunkActionState) => {
  state.status = LOADING;
  state.error = undefined;
};

const setError = (
  state: ThunkActionState,
  action: { error: SerializedError }
) => {
  state.status = IDLE;
  state.error = action.error;
};

const reducer = createReducer(
  adapter.getInitialState<ThunkActionState>({
    status: IDLE,
  }),
  {
    [loadDistribuidores.pending.type]: setLoading,
    [loadDistribuidores.rejected.type]: setError,
    [loadDistribuidores.fulfilled.type]: (state, action) => {
      state.status = LOADED;
      adapter.setAll(state, action);
    },
    // createDistribuidor
    [createDistribuidor.pending.type]: setLoading,
    [createDistribuidor.rejected.type]: setError,
    [createDistribuidor.fulfilled.type]: (state, action) => {
      state.status = LOADED;
      adapter.addOne(state, action);
    },
    // updateDistribuidor
    [updateDistribuidor.pending.type]: setLoading,
    [updateDistribuidor.rejected.type]: setError,
    [updateDistribuidor.fulfilled.type]: (state, action) => {
      state.status = LOADED;
      const { idDistribuidor, ...changes } = action.payload;
      adapter.updateOne(state, { id: idDistribuidor, changes });
    },
    // deleteDistribuidor
    [deleteDistribuidor.pending.type]: setLoading,
    [deleteDistribuidor.rejected.type]: setError,
    [deleteDistribuidor.fulfilled.type]: (state, action) => {
      state.status = LOADED;
      adapter.removeOne(state, action);
    },
  }
);

export default reducer;
