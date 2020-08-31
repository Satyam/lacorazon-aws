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
  (status, error, data) => ({ status, error, data })
);

export const selDistribuidorData = selectors.selectById;
