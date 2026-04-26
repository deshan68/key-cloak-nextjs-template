"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";

/**
 * Must be a Client Component — Redux Provider uses context.
 * Place this inside KeycloakProvider in app/layout.tsx.
 *
 * `makeStore` pattern: one store instance per request on server, one shared
 * instance on the client. This avoids state leaking between SSR requests.
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
