"use client";

import type { ReactNode } from "react";

/**
 * Client provider component for wrapping the app
 * Makes sure clients are initialized at the right time
 * (After session is loaded from NextAuth)
 */
export function ClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
