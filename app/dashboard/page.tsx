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
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p>
              Welcome back,{" "}
              <strong>{session?.user?.name || session?.user?.email}</strong>
            </p>
          </div>

          <Button onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="border rounded-lg p-5 space-y-3">
            <h2 className="text-lg font-medium">User Management</h2>
            <p className="text-sm">
              Create and manage user accounts with Keycloak authentication
            </p>

            <Link href="/create-user">
              <Button>Create New User</Button>
            </Link>
          </div>

          {/* Profile */}
          <div className="border rounded-lg p-5 space-y-3">
            <h2 className="text-lg font-medium">User Profile</h2>
            <p className="text-sm">View and manage your profile information</p>

            <div className="text-sm space-y-1">
              <p>
                <strong>Email:</strong> {session?.user?.email}
              </p>
              <p>
                <strong>Name:</strong> {session?.user?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
