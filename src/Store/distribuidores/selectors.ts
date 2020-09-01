import adapter from './adapter';
import { RootState } from 'Store';
import { createSelector } from '@reduxjs/toolkit';
const selectors = adapter.getSelectors<RootState>(
  (state) => state.distribuidores
);

export const selDistribuidoresData = selectors.selectAll;
export const selDistribuidoresStatus = (state: RootState) =>
  state.distribuidores.status;
export const selDistribuidoresError = (state: RootState) =>
  state.distribuidores.error;

export const selDistribuidores = createSelector(
  selDistribuidoresStatus,
  selDistribuidoresError,
  selDistribuidoresData,
  (status, error, distribuidores) => ({ status, error, distribuidores })
);

export const selDistribuidoresHash = selectors.selectEntities;

// export const selDistribuidorData = selectors.selectById;

// export const selDistribuidor = createSelector(
//   selDistribuidoresStatus,
//   selDistribuidoresError,
//   selDistribuidorData,
//   (status, error, distribuidor) => ({ status, error, distribuidor })
// )
