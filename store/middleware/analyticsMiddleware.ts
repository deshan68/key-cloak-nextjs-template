import type { Middleware } from "@reduxjs/toolkit";

/** Map action types you want to track → analytics event names. */
const TRACKED_ACTIONS: Record<string, string> = {
  "auth/loginUser/fulfilled": "user_login",
  "auth/logoutUser/fulfilled": "user_logout",
};

/**
 * Forwards specific Redux actions to your analytics provider (e.g. Segment,
 * PostHog, Mixpanel). Swap the `track()` call for your real SDK.
 */
export const analyticsMiddleware: Middleware = (_api) => (next) => (action) => {
  const result = next(action);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actionType = (action as any)?.type as string | undefined;
  if (actionType && TRACKED_ACTIONS[actionType]) {
    // Replace with your analytics SDK, e.g.: analytics.track(event, props)
    // eslint-disable-next-line no-console
    console.info(`[Analytics] track: ${TRACKED_ACTIONS[actionType]}`, action);
  }
  return result;
};
