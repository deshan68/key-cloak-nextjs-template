// ─── Enums ───────────────────────────────────────────────────────────────────

export type NotificationType = "success" | "error" | "info" | "warning";

// ─── Entities ────────────────────────────────────────────────────────────────

export interface Notification {
  id: string; // nanoid — unique per toast
  type: NotificationType;
  title: string;
  message?: string;
  /** Auto-dismiss after N ms. Omit for sticky (user must close manually). */
  duration?: number;
  /** When truthy, shows an action button inside the toast. */
  action?: NotificationAction;
  createdAt: number; // Unix ms
}

export interface NotificationAction {
  label: string;
  /** Redux action type to dispatch when the user clicks the action button. */
  dispatchType: string;
}

// ─── Slice state ─────────────────────────────────────────────────────────────

export interface NotificationsState {
  items: Notification[];
}

// ─── Thunk payloads ──────────────────────────────────────────────────────────

export type AddNotificationPayload = Omit<Notification, "id" | "createdAt">;
