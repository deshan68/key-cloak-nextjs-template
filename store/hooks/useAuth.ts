import { useAppSelector } from "./index";
import { useMemo } from "react";

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);

  return useMemo(
    () => ({
      ...auth,
      isAuthenticated: auth.status === "authenticated",
      isLoading: auth.status === "loading",
      isError: auth.status === "error",
    }),
    [auth]
  );
}