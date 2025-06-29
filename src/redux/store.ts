import { configureStore, combineReducers } from '@reduxjs/toolkit';

import filtersReducer from './filtersSlice';
import contentsReducer from './contentsSlice';

const rootReducer = combineReducers({
  filters: filtersReducer,
  contents: contentsReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});
