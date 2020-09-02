import { createReducer, AnyAction, PayloadAction } from '@reduxjs/toolkit';
import { IDLE, LOADING, LOADED, ThunkActionState } from 'Store/constants';
import adapter from './adapter';

import {
  loadDistribuidores,
  createDistribuidor,
  updateDistribuidor,
  deleteDistribuidor,
} from './actions';

const reducer = createReducer(
  adapter.getInitialState<ThunkActionState>({
    status: IDLE,
  }),
  (builder) =>
    builder
      .addCase(loadDistribuidores.fulfilled.type, adapter.setAll)
      .addCase(createDistribuidor.fulfilled.type, adapter.addOne)
      .addCase(updateDistribuidor.fulfilled.type, adapter.upsertOne)
      .addCase(deleteDistribuidor.fulfilled.type, adapter.removeOne)
      .addMatcher(
        (action: AnyAction): action is PayloadAction<any> =>
          action.type.endsWith('/pending'),
        (state) => {
          state.status = LOADING;
          state.error = undefined;
        }
      )
      .addMatcher(
        (action: AnyAction): action is PayloadAction<any> =>
          action.type.endsWith('/rejected'),
        (state, action: AnyAction) => {
          state.status = IDLE;
          state.error = action.error;
        }
      )
      .addMatcher(
        (action: AnyAction): action is PayloadAction<any> =>
          action.type.endsWith('/fulfilled'),
        (state) => {
          state.status = LOADED;
          state.error = undefined;
        }
      )
);

export default reducer;
