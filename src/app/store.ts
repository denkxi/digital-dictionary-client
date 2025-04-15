import { configureStore } from '@reduxjs/toolkit';
import { wordCategoryApi } from '../features/wordCategories/services/wordCategoryApi';
import { authApi } from '../features/auth/services/authApi';
import authReducer from '../features/auth/slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [wordCategoryApi.reducerPath]: wordCategoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wordCategoryApi.middleware, authApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
