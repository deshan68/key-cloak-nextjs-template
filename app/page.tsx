"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js + Keycloak
          </h1>
          <p className="text-gray-600 mb-8">
            Secure authentication with Keycloak and NextAuth.js
          </p>

          {!session ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                You are not signed in. Please sign in to access protected
                resources.
              </p>
              <button
                onClick={() =>
                  signIn("keycloak", {
                    redirect: true,
                    callbackUrl: "/dashboard",
                  })
                }
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Sign in with Keycloak
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">
                Signed in as <strong>{session.user?.email}</strong>
              </p>
              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/create-user"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create New User
        </Link>
      </div>
    </main>
  );
}
