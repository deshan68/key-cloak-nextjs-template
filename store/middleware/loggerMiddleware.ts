import type { Middleware } from "@reduxjs/toolkit";

/**
 * Logs dispatched actions and state changes in development mode.
 * Useful for debugging Redux state flow.
 */
export const loggerMiddleware: Middleware =
  (api) => (next) => (action) => {
    // eslint-disable-next-line no-console
    console.log("Dispatching:", action);
    const result = next(action);
    // eslint-disable-next-line no-console
    console.log("Next state:", api.getState());
    return result;
  };