import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "../../types/index";

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  error: null,
  tokenExpiresAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Used by the RTK Query base API to update the token after a silent refresh
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    // Optimistically update the user profile without a network round-trip
    updateUserProfile(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) Object.assign(state.user, action.payload);
    },
    resetAuthStatus(state) {
      state.error = null;
      state.tokenExpiresAt = null;
    },
  },
});

export const { setToken, updateUserProfile, resetAuthStatus } =
  authSlice.actions;
export default authSlice.reducer;
export * from "./auth-selectors";
