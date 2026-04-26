import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { addNotification } from "../slices/notifications-slice";

/**
 * Catches every RTK Query error and rejected async thunk and dispatches
 * a user-visible notification. Individual thunks can opt-out by setting
 * `meta.skipGlobalErrorHandler = true` in their rejectWithValue payload.
 */
export const errorMiddleware: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = action.payload as any;
    if (!payload?.skipGlobalErrorHandler) {
      api.dispatch(
        addNotification({
          type: "error",
          title: "Something went wrong",
          message: payload?.message ?? "An unexpected error occurred.",
          duration: 6000,
        })
      );
    }
  }
  return next(action);
};