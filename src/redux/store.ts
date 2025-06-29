import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';
import contentsReducer from './contentsSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    contents: contentsReducer,
  },
});
