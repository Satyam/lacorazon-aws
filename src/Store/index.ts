import { configureStore } from '@reduxjs/toolkit';

import distribuidores from './distribuidores/reducer';

const store = configureStore({
  reducer: {
    distribuidores,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
