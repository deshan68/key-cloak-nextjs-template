"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <Button variant="secondary">Click me</Button>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back,{" "}
                <strong>{session?.user?.name || session?.user?.email}</strong>
              </p>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="destructive"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* User Management Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  User Management
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Create and manage user accounts with Keycloak authentication
              </p>
              <Link
                href="/create-user"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create New User
              </Link>
            </div>

            {/* Profile Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  User Profile
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                View and manage your profile information
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> {session?.user?.email}
                </p>
                <p className="text-sm">
                  <strong>Name:</strong> {session?.user?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
