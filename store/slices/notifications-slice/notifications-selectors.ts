import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../types";

const selectNotificationsSlice = (state: RootState) => state.notifications;

export const selectNotifications = createSelector(
  selectNotificationsSlice,
  (notifications) => notifications.items,
);

export const selectNotificationCount = createSelector(
  selectNotifications,
  (items) => items.length,
);