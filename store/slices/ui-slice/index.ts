import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UIState } from "../../types/index";

const initialState: UIState = {
  theme: "system",
  locale: "en",
  sidebar: "auto",
  activeModal: null,
  pageLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<UIState["theme"]>) {
      state.theme = action.payload;
    },
    toggleSidebar(state) {
      state.sidebar = state.sidebar === "expanded" ? "collapsed" : "expanded";
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebar = action.payload ? "expanded" : "collapsed";
    },
    setLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload;
    },
  },
});

export const { setTheme, toggleSidebar, setSidebarOpen, setLocale } =
  uiSlice.actions;
export default uiSlice.reducer;
export * from "./ui-selectors";
