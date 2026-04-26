import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { persistConfig } from "./persist-config";
import authReducer from "./slices/auth-slice";
import uiReducer from "./slices/ui-slice";
import notificationsReducer from "./slices/notifications-slice";

const combinedReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notifications: notificationsReducer,
});

export const rootReducer = persistReducer(persistConfig, combinedReducer);
