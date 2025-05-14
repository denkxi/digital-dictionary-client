import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { wordCategoryApi } from "../features/wordCategories/services/wordCategoryApi";
import { authApi } from "../features/auth/services/authApi";
import { dictionaryApi } from "../features/dictionaries/services/dictionaryApi";
import { wordApi } from "../features/words/services/wordApi";
import { quizApi } from "../features/quizzes/services/quizApi";
import { statisticsApi } from "../features/statistics/services/statisticsApi";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../features/auth/slices/authSlice";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const appReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [wordCategoryApi.reducerPath]: wordCategoryApi.reducer,
  [dictionaryApi.reducerPath]: dictionaryApi.reducer,
  [wordApi.reducerPath]: wordApi.reducer,
  [quizApi.reducerPath]: quizApi.reducer,
  [statisticsApi.reducerPath]: statisticsApi.reducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === "LOGOUT_CLEANUP") {
    state = undefined;
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      wordCategoryApi.middleware,
      authApi.middleware,
      dictionaryApi.middleware,
      wordApi.middleware,
      quizApi.middleware,
      statisticsApi.middleware
    ),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
