import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../types";

const selectAuthSlice = (state: RootState) => state.auth;

export const selectCurrentUser = createSelector(
  selectAuthSlice,
  (auth) => auth.user,
);

export const selectAuthToken = createSelector(
  selectAuthSlice,
  (auth) => auth.token,
);

export const selectIsAuthenticated = createSelector(
  selectAuthSlice,
  (auth) => auth.user !== null && auth.token !== null,
);

export const selectAuthStatus = createSelector(
  selectAuthSlice,
  (auth) => auth.status,
);

export const selectAuthError = createSelector(
  selectAuthSlice,
  (auth) => auth.error,
);

export const selectUserRoles = createSelector(
  selectCurrentUser,
  (user) => user?.roles ?? [],
);

/** Returns true if the current user has ALL of the requested roles. */
export const selectHasRoles = (roles: string[]) =>
  createSelector(selectUserRoles, (userRoles) =>
    roles.every((r) => userRoles.includes(r)),
  );
