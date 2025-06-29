import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import filtersReducer from './filtersSlice';
import contentsReducer from './contentsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['filters'] // or include 'contents' if needed
};

const rootReducer = combineReducers({
  filters: filtersReducer,
  contents: contentsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required by redux-persist
    }),
});

export const persistor = persistStore(store);
