import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationsState } from "../../types/index";

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action: PayloadAction<Notification>) {
        // Cap at 5 visible notifications — drop the oldest
        if (state.items.length >= 5) state.items.shift();
        state.items.push(action.payload);
      },
      prepare(payload: Omit<Notification, "id" | "createdAt">) {
        return {
          payload: {
            ...payload,
            id: nanoid(),
            createdAt: Date.now(),
          } as Notification,
        };
      },
    },
    dismissNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications(state) {
      state.items = [];
    },
  },
});

export const { addNotification, dismissNotification, clearAllNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
export * from "./notifications-selectors";
