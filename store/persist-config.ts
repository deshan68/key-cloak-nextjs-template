import { createTransform, type PersistConfig } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import type { CombinedState } from "./types/combined-state.types";
import type { AuthState } from "./types/auth.types";

// ─── SSR-safe storage ────────────────────────────────────────────────────────

function createNoopStorage() {
  return {
    getItem: (_key: string) => Promise.resolve<string | null>(null),
    setItem: (_key: string, value: string) => Promise.resolve(value),
    removeItem: (_key: string) => Promise.resolve(),
  };
}

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// ─── Transforms ──────────────────────────────────────────────────────────────

// The transform generics are <InboundState, OutboundState, RootState>.
// RootState must be CombinedState — the same type used in PersistConfig below.
const authTransform = createTransform<AuthState, AuthState, CombinedState>(
  (inbound) => inbound,
  (outbound) => ({
    ...outbound,
    error: null,
    tokenExpiresAt: null,
  }),
  { whitelist: ["auth"] },
);

// ─── Config ──────────────────────────────────────────────────────────────────
// CombinedState is imported from types/ — not from rootReducer —
// so there is no circular dependency.

export const persistConfig: PersistConfig<CombinedState> = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "ui"],
  transforms: [authTransform],
};
