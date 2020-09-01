import adapter from './adapter';
import { RootState } from 'Store';
import { createSelector } from '@reduxjs/toolkit';
const selectors = adapter.getSelectors<RootState>(
  (state) => state.distribuidores
);

export const selDistribuidoresStatus = (state: RootState) =>
  state.distribuidores.status;
export const selDistribuidoresError = (state: RootState) =>
  state.distribuidores.error;

export const selDistribuidores = createSelector(
  selDistribuidoresStatus,
  selDistribuidoresError,
  selectors.selectAll,
  (status, error, distribuidores) => ({ status, error, distribuidores })
);

export const selDistribuidoresHash = createSelector(
  selDistribuidoresStatus,
  selDistribuidoresError,
  selectors.selectEntities,
  (status, error, entities) => ({ status, error, entities })
);
