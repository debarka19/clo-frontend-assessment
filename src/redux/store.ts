import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';
import contentsReducer from './contentsSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    contents: contentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
