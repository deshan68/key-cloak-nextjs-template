"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
  useEffect(() => {
    signIn("keycloak", { callbackUrl: "/dashboard" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    </div>
  );
}
