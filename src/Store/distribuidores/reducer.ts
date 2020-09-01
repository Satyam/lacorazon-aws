import { createReducer } from '@reduxjs/toolkit';
import { IDLE, LOADING, LOADED, ThunkActionState } from 'Store/constants';
import adapter from './adapter';

import { loadDistribuidores, deleteDistribuidor } from './actions';

const reducer = createReducer(
  adapter.getInitialState<ThunkActionState>({
    status: IDLE,
  }),
  {
    [loadDistribuidores.pending.type]: (state, action) => {
      state.status = LOADING;
      state.error = undefined;
    },
    [loadDistribuidores.rejected.type]: (state, action) => {
      state.status = IDLE;
      state.error = action.error;
    },
    [loadDistribuidores.fulfilled.type]: (state, action) => {
      state.status = LOADED;
      adapter.setAll(state, action);
    },
    // deleteDistribuidor
    [deleteDistribuidor.pending.type]: (state, action) => {
      state.status = LOADING;
      state.error = undefined;
    },
    [deleteDistribuidor.rejected.type]: (state, action) => {
      state.status = IDLE;
      state.error = action.error;
    },
    [deleteDistribuidor.fulfilled.type]: (state, action) => {
      state.status = LOADED;
      adapter.removeOne(state, action);
    },
  }
);

export default reducer;
