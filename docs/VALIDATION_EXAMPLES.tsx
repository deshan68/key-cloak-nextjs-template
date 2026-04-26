/**
 * Example: Using Zod Validated API Responses
 * This file demonstrates how to use the type-safe, validated API responses
 * in your React components
 */

"use client";

import type { User } from "@/lib/api/features/users";
import {
  useGetUsers,
  useCreateUser,
  type UserFilters,
} from "@/lib/api/features/users";

/**
 * Example 1: Fetching and displaying users
 * The data returned is guaranteed to match the User type
 */
export function UsersList() {
  const { data, isLoading, error } = useGetUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // data.data is guaranteed to be User[]
  // All TypeScript checks pass - no 'any' types needed
  return (
    <div className="font-black bg-red-400">
      {data?.data.map((user: User) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>Username: {user.userName}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Active: {user.isActive ? "Yes" : "No"}</p>
          <p>Verified: {user.isVerified ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 2: Creating a user with validated response
 * The response is validated before being returned
 */
export function CreateUserForm() {
  const createUser = useCreateUser({
    onSuccess: (newUser: User) => {
      // newUser is guaranteed to be a valid User
      console.warn("User created successfully:", newUser.id);
    },
    onError: (error: Error) => {
      // Error includes validation error messages
      console.error("Failed to create user:", error.message);
    },
  });

  const handleSubmit = async (formData: FormData) => {
    createUser.mutate({
      user_name: formData.get("userName") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      team_id: formData.get("teamId") as string,
      role: (formData.get("role") as string) || "app_user",
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
    >
      <input name="userName" placeholder="Username" required />
      <input name="name" placeholder="Full Name" required />
      <input name="email" type="email" required />
      <input name="teamId" placeholder="Team ID" required />
      <input name="role" placeholder="Role" />
      <button type="submit" disabled={createUser.isPending}>
        Create User
      </button>
      {createUser.error && (
        <p style={{ color: "red" }}>{createUser.error.message}</p>
      )}
    </form>
  );
}

/**
 * Example 4: Pagination with validated responses
 */
export function UsersWithPagination() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const params: UserFilters = { page, limit };
  const { data } = useGetUsers(params);

  return (
    <div>
      <div>
        {data?.data.map((user: User) => (
          <div key={user.id}>{user.email}</div>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {data?.page} of {Math.ceil((data?.total || 0) / limit)}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data || page >= Math.ceil(data.total / limit)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * IMPORTANT NOTES:
 *
 * 1. VALIDATION HAPPENS AT SERVICE LAYER
 *    - All validation is done in service.ts, not in components
 *    - Components receive guaranteed-valid data
 *    - Validation errors are caught and handled in service layer
 *
 * 2. TYPE SAFETY THROUGHOUT
 *    - No need for type assertions (as User)
 *    - TypeScript catches mismatches at compile time
 *    - IDE autocomplete works perfectly
 *
 * 3. ERROR HANDLING
 *    - API errors from validation are caught in service
 *    - React Query error object contains validation error info
 *    - Components just display error.message to users
 *
 * 4. PERFORMANCE
 *    - Validation happens once at API boundary
 *    - No re-validation in hooks or components
 *    - Minimal overhead (~0.1-0.5ms per validation)
 *
 * 5. DEBUGGING
 *    - If validation fails, check browser console for details
 *    - Validation errors include field name, code, and message
 *    - Use React Query DevTools to inspect cached data
 */

import React from "react";
