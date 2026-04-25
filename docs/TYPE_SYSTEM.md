# Type System Architecture

This document explains the type organization and conventions used throughout the Keycloak Next.js template.

## Overview

The application uses a **feature-based type organization** where types are grouped by their functional domain. This ensures:
- **Discoverability**: Types are located near the code that uses them
- **Maintainability**: Related types stay together during refactoring
- **Scalability**: New features can follow the established pattern
- **Type safety**: Clear export patterns prevent circular imports

## Directory Structure

```
lib/api/
├── features/
│   ├── users/
│   │   ├── types.ts          # User domain types
│   │   ├── service.ts         # API client logic
│   │   ├── queries.ts         # React Query hooks (read)
│   │   ├── mutations.ts       # React Query hooks (write)
│   │   └── index.ts           # Barrel export
│   ├── dashboard/
│   │   ├── types.ts
│   │   ├── service.ts
│   │   ├── queries.ts
│   │   └── index.ts
│   └── ...
├── config/
│   └── query-keys.ts          # React Query key factory
└── client.ts                  # Shared API client setup
```

## Type Organization Pattern

### 1. **types.ts** - Type Definitions

Location: `lib/api/features/<feature>/types.ts`

**Purpose**: Define all types and interfaces for a feature domain

**Exports**:
- Domain entities (e.g., `User`, `DashboardStats`)
- Request/Response DTOs (e.g., `CreateUserRequest`, `UsersListResponse`)
- Filters/Parameters (e.g., `UserFilters`, `DashboardActivityFilters`)

**Example**:
```typescript
// lib/api/features/users/types.ts
export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserRequest = {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export type UsersListResponse = {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
};

export type UserFilters = {
  search?: string;
  enabled?: boolean;
  page?: number;
  pageSize?: number;
};
```

### 2. **service.ts** - API Client Logic

Location: `lib/api/features/<feature>/service.ts`

**Purpose**: Direct API communication layer

**Key Points**:
- Takes typed API client as parameter
- Returns types from `types.ts`
- Contains error handling
- No React hooks
- Pure functions

**Pattern**:
```typescript
import type { PostgrestClient } from "@supabase/postgrest-js";
import type { User, CreateUserRequest, UserFilters, UsersListResponse } from "./types";

export const userService = {
  async getUsers(client: PostgrestClient, filters?: UserFilters): Promise<UsersListResponse> {
    // Implementation
  },

  async getUserById(client: PostgrestClient, id: string): Promise<User> {
    // Implementation
  },

  async createUser(client: PostgrestClient, data: CreateUserRequest): Promise<User> {
    // Implementation
  },
};
```

### 3. **queries.ts** - Read Operations

Location: `lib/api/features/<feature>/queries.ts`

**Purpose**: React Query hooks for data fetching (read-only)

**Key Points**:
- Uses `useQuery` (not `useMutation`)
- Wraps `service.ts` functions
- Manages loading/error states
- Integrates with React Query cache
- Handles query keys via `queryKeys` factory

**Pattern**:
```typescript
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { userService } from "./service";
import type { UserFilters } from "./types";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";

export function useGetUsers(
  params?: UserFilters,
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const apiClient = usePostgrestClient();

  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => {
      if (!apiClient) throw new Error("API client not available");
      return userService.getUsers(apiClient, params);
    },
    enabled: !!apiClient,
    ...options,
  });
}
```

### 4. **mutations.ts** - Write Operations

Location: `lib/api/features/<feature>/mutations.ts`

**Purpose**: React Query hooks for data mutations (create/update/delete)

**Key Points**:
- Uses `useMutation` (not `useQuery`)
- Wraps `service.ts` functions
- Handles request/error states
- Manages query invalidation
- Provides success/error callbacks

**Pattern**:
```typescript
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/config/query-keys";
import { userService } from "./service";
import type { User, CreateUserRequest } from "./types";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";

export function useCreateUser(
  options?: Omit<UseMutationOptions<User, Error, CreateUserRequest>, "mutationFn">,
) {
  const apiClient = usePostgrestClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      if (!apiClient) throw new Error("API client not available");
      return userService.createUser(apiClient, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    ...options,
  });
}
```

### 5. **index.ts** - Barrel Export

Location: `lib/api/features/<feature>/index.ts`

**Purpose**: Single entry point for all feature exports

**Pattern**:
```typescript
// Export types
export type { User, CreateUserRequest, UpdateUserRequest, UsersListResponse, UserFilters } from "./types";

// Export all queries and mutations
export * from "./service";
export * from "./queries";
export * from "./mutations";
```

**Usage**: Enables clean imports
```typescript
// Instead of:
import { User } from "@/lib/api/features/users/types";
import { useGetUsers } from "@/lib/api/features/users/queries";
import { useCreateUser } from "@/lib/api/features/users/mutations";

// Use:
import type { User } from "@/lib/api/features/users";
import { useGetUsers, useCreateUser } from "@/lib/api/features/users";
```

## Query Key Factory

Location: `lib/api/config/query-keys.ts`

**Purpose**: Centralized React Query key management

**Pattern**:
```typescript
export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (filters?: UserFilters) => [...queryKeys.users.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    activity: (filters?: DashboardActivityFilters) => [...queryKeys.dashboard.all, "activity", filters] as const,
  },
};
```

**Benefits**:
- Single source of truth for cache keys
- Easy invalidation patterns
- Consistent key structure
- TypeScript-safe

## Import Conventions

### Types

Always use `type` keyword for type-only imports to prevent circular dependencies:

```typescript
import type { User, CreateUserRequest } from "@/lib/api/features/users";
```

### Values

Import values without `type` keyword:

```typescript
import { useGetUsers, useCreateUser } from "@/lib/api/features/users";
import { userService } from "@/lib/api/features/users/service";
```

### Mixed

```typescript
import type { User } from "@/lib/api/features/users";
import { useGetUsers } from "@/lib/api/features/users";
```

## Composition Example

**Component using the type system**:

```typescript
"use client";

import type { User } from "@/lib/api/features/users";
import { useGetUsers, useCreateUser } from "@/lib/api/features/users";
import { UserForm } from "./UserForm";
import { UserList } from "./UserList";

export function UsersView() {
  const { data, isLoading, error } = useGetUsers();
  const createUser = useCreateUser({
    onSuccess: (newUser: User) => {
      console.log("User created:", newUser);
    },
  });

  return (
    <div>
      <UserForm onSubmit={(data) => createUser.mutate(data)} />
      <UserList users={data?.data} isLoading={isLoading} error={error} />
    </div>
  );
}
```

## Error Handling

All service functions should include proper error handling:

```typescript
// lib/api/features/users/service.ts
export const userService = {
  async getUserById(client: PostgrestClient, id: string): Promise<User> {
    try {
      const { data, error } = await client
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("User not found");

      return data as User;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  },
};
```

## Adding New Features

To add a new feature to the API layer:

1. **Create feature directory**:
   ```bash
   mkdir -p lib/api/features/newfeature
   ```

2. **Create files in order**:
   - `types.ts` - Define all types
   - `service.ts` - API client logic
   - `queries.ts` - React Query read hooks
   - `mutations.ts` - React Query write hooks
   - `index.ts` - Barrel export

3. **Add query keys**:
   ```typescript
   // lib/api/config/query-keys.ts
   newfeature: {
     all: ["newfeature"] as const,
     list: () => [...queryKeys.newfeature.all, "list"] as const,
     // ... more keys
   },
   ```

4. **Use in components**:
   ```typescript
   import type { NewFeatureType } from "@/lib/api/features/newfeature";
   import { useGetNewFeatures } from "@/lib/api/features/newfeature";
   ```

## Best Practices

### ✅ DO

- Keep types close to their usage
- Use barrel exports for clean imports
- Always use `type` keyword for type-only imports
- Centralize query keys in the factory
- Handle errors explicitly in service layer
- Document complex types with JSDoc comments
- Group related types together

### ❌ DON'T

- Mix service logic with React hooks
- Create global type files for single-feature types
- Use `any` types without explicit justification
- Import directly from service/queries/mutations files when barrel export exists
- Forget to invalidate queries on mutations
- Spread options unsafely without `Omit<...>`

## TypeScript Configuration

The project uses strict TypeScript settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

This ensures:
- All types are explicitly defined
- Null/undefined are handled properly
- No unused code
- Consistent error handling

## Debugging Type Issues

**Circular imports**: Check that `types.ts` doesn't import from `queries.ts` or `mutations.ts`

**Unused imports**: Run `npm run lint` to check for unused imports

**Type mismatches**: Use VSCode's "Go to Type Definition" (Cmd+Click) to trace type origins

**Missing exports**: Verify `index.ts` includes all necessary exports with proper syntax

## Migration from Global Types

If moving types from a global `types/` directory:

1. Create feature-specific `types.ts` file
2. Move related types there
3. Update imports in service/query/mutation files
4. Update barrel exports
5. Update component imports
6. Remove from global types file
7. Run linter and tests

This maintains type safety throughout the migration process.
