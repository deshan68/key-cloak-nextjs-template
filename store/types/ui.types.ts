// ─── Enums ───────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";

export type Locale = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | string; // extend as needed

export type SidebarVariant = "expanded" | "collapsed" | "auto";

// ─── Slice state ─────────────────────────────────────────────────────────────

export interface UIState {
  theme: Theme;
  locale: Locale;
  sidebar: SidebarVariant;
  /** Tracks which modal is open; null = none. Avoids per-modal boolean fields. */
  activeModal: ModalKey | null;
  /** Page-level loading overlay — for top-level route transitions. */
  pageLoading: boolean;
}

// ─── Modal registry ──────────────────────────────────────────────────────────
// Add a new key here whenever you add a new modal.

export type ModalKey =
  | "createUser"
  | "deleteUser"
  | "editProfile"
  | "confirmLogout"
  | "uploadAvatar";

export interface OpenModalPayload {
  key: ModalKey;
}
