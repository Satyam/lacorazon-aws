import { createReducer } from '@reduxjs/toolkit';
import { IDLE, LOADING, LOADED, ThunkActionState } from 'Store/constants';
import adapter from './adapter';

import { listDistribuidores } from './actions';

const reducer = createReducer(
  adapter.getInitialState<ThunkActionState>({
    status: IDLE,
  }),
  {
    [listDistribuidores.pending.type]: (state, action) => {
      state.status = LOADING;
      state.error = undefined;
    },
    [listDistribuidores.rejected.type]: (state, action) => {
      state.status = IDLE;
      state.error = action.error;
    },
    [listDistribuidores.fulfilled.type]: (state, action) => {
      state.status = LOADED;
      adapter.setAll(state, action);
    },
  }
);

export default reducer;
