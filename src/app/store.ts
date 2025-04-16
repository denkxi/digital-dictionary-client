import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { wordCategoryApi } from '../features/wordCategories/services/wordCategoryApi';
import { authApi } from '../features/auth/services/authApi';
import { dictionaryApi } from '../features/dictionaries/services/dictionaryApi';
import { wordApi } from '../features/words/services/wordApi';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from '../features/auth/slices/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [wordCategoryApi.reducerPath]: wordCategoryApi.reducer,
  [dictionaryApi.reducerPath]: dictionaryApi.reducer,
  [wordApi.reducerPath]: wordApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(wordCategoryApi.middleware, authApi.middleware, dictionaryApi.middleware, wordApi.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
