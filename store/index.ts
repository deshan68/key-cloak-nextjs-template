import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { rootReducer } from "./root-reducer";
import {
  errorMiddleware,
  loggerMiddleware,
  analyticsMiddleware,
} from "./middleware";

export const store: EnhancedStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(errorMiddleware)
      .concat(analyticsMiddleware)
      .concat(process.env.NODE_ENV === "development" ? [loggerMiddleware] : []),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type { RootState, AppDispatch, AppThunk } from "./types";
export { useAppDispatch, useAppSelector } from "./hooks";
export { useAuth } from "./hooks/useAuth";
