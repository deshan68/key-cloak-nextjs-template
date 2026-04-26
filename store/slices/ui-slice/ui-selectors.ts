import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../types";

const selectUISlice = (state: RootState) => state.ui;

export const selectTheme = createSelector(
  selectUISlice,
  (ui) => ui.theme,
);

export const selectSidebarOpen = createSelector(
  selectUISlice,
  (ui) => ui.sidebarOpen,
);

export const selectLocale = createSelector(
  selectUISlice,
  (ui) => ui.locale,
);