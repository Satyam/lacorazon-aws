import { SerializedError } from '@reduxjs/toolkit';

export const IDLE = 'idle';
export const LOADING = 'loading';
export const LOADED = 'loaded';

export type ThunkActionState = {
  status: 'idle' | 'loading' | 'loaded';
  error?: SerializedError;
};
