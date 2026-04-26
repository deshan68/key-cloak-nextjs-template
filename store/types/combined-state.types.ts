import type { AuthState } from "./auth.types";
import type { UIState } from "./ui.types";
import type { NotificationsState } from "./notifications.types";

/**
 * Declared here — not derived from the store — to avoid a circular dependency:
 *   rootReducer → persist-config → rootReducer
 *
 * rootReducer passes this as the generic to both combineReducers and
 * persistReducer. persistConfig uses it for PersistConfig<CombinedState>.
 * Both imports resolve to the same type, so TypeScript is satisfied.
 */
export interface CombinedState {
  auth: AuthState;
  ui: UIState;
  notifications: NotificationsState;
}
