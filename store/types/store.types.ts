import type { store } from "../index";
import type { ThunkAction, Action } from "@reduxjs/toolkit";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Use for thunks that need access to the full store.
 * @example
 * const myThunk = (): AppThunk => (dispatch, getState) => { ... }
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
