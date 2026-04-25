# React Query (TanStack Query) Integration Guide

## Installation

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## Folder Structure

```
lib/api/
├── config/
│   ├── query-keys.ts       # Centralized query key management
│   ├── query-client.ts     # QueryClient configuration
│   └── index.ts
├── features/               # Feature-based API organization
│   ├── users/
│   │   ├── service.ts      # API service functions
│   │   ├── queries.ts      # React Query hooks (reads)
│   │   ├── mutations.ts    # React Query hooks (writes)
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── service.ts
│   │   ├── queries.ts
│   │   └── index.ts
│   └── index.ts
├── examples/               # Usage examples
│   ├── user-list-example.tsx
│   ├── dashboard-example.tsx
│   ├── server-actions-example.ts
│   └── index.ts
└── index.ts
```

## Architecture Overview

### 1. Query Keys (`lib/api/config/query-keys.ts`)

Centralized query key management using TanStack Query conventions:

```typescript
export const queryKeys = {
  users: {
    all: ["users"],
    lists: () => [...queryKeys.users.all, "list"],
    list: (filters) => [...queryKeys.users.lists(), filters],
    details: () => [...queryKeys.users.all, "detail"],
    detail: (userId) => [...queryKeys.users.details(), userId],
  },
  dashboard: {
    all: ["dashboard"],
    stats: () => [...queryKeys.dashboard.all, "stats"],
    overview: () => [...queryKeys.dashboard.all, "overview"],
  },
};
```

**Benefits:**
- Type-safe query keys
- Hierarchical structure for easy invalidation
- Reusable across components
- Prevents typos and inconsistencies

### 2. Service Functions (`lib/api/features/*/service.ts`)

Pure API functions (not hooks) - can be reused anywhere:

```typescript
export const userService = {
  getUsers: async (apiClient, params) => { /* ... */ },
  getUserById: async (apiClient, userId) => { /* ... */ },
  createUser: async (apiClient, data) => { /* ... */ },
  updateUser: async (apiClient, userId, data) => { /* ... */ },
  deleteUser: async (apiClient, userId) => { /* ... */ },
};
```

**Benefits:**
- Reusable in Server Actions
- Testable independently
- Can be called without React hooks
- Decoupled from UI layer

### 3. Query Hooks (`lib/api/features/*/queries.ts`)

React hooks for reading data:

```typescript
// Simple query
export function useGetUsers(params?, options?) {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => userService.getUsers(apiClient, params),
    enabled: !!apiClient,
    ...options,
  });
}

// Infinite query
export function useGetUsersInfinite(params?, options?) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.infiniteList(params),
    queryFn: async ({ pageParam = 0 }) => { /* ... */ },
    // ... config
  });
}
```

**Features:**
- Automatic caching
- Background refetching
- Pagination support
- Error handling
- Loading states

### 4. Mutation Hooks (`lib/api/features/*/mutations.ts`)

React hooks for writing data:

```typescript
export function useCreateUser(options?) {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => userService.createUser(apiClient, data),
    onSuccess: (newUser) => {
      // Update cache
      queryClient.setQueryData(queryKeys.users.detail(newUser.id), newUser);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
    ...options,
  });
}
```

**Features:**
- Optimistic updates
- Automatic cache invalidation
- Error handling
- Loading states
- Rollback on error

## Usage Examples

### In Components (Client-Side)

```tsx
"use client";

import { useGetUsers, useCreateUser, useDeleteUser } from "@/lib/api/features/users";

export function UserList() {
  // Query hook - automatic caching and refetching
  const { data, isLoading, error } = useGetUsers({ page: 1, limit: 10 });

  // Mutation hooks
  const { mutate: createUser } = useCreateUser({
    onSuccess: () => alert("User created!"),
  });

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => alert("User deleted!"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return (
    <div>
      <button onClick={() => createUser({ /* ... */ })}>
        Create User
      </button>
      
      {data?.data.map(user => (
        <div key={user.id}>
          <p>{user.email}</p>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### In Server Actions

```tsx
"use server";

import { userService } from "@/lib/api/features/users";
import { createServerApiClient } from "@/lib/clients/api-client";

export async function fetchUsersAction() {
  const apiClient = createServerApiClient();
  return userService.getUsers(apiClient, { limit: 10 });
}
```

## Query Configuration

### Default Settings

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes (garbage collection)
      retry: 3,                         // Retry 3 times
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: 1,
      retryDelay: 500,
    },
  },
});
```

### Custom Options per Hook

```tsx
// Refetch every minute
useGetUsers(
  { page: 1 },
  { refetchInterval: 1000 * 60 }
);

// Disable automatic refetch on window focus
useGetUsers(
  { page: 1 },
  { refetchOnWindowFocus: false }
);

// Disable retries for this query
useGetUsers(
  { page: 1 },
  { retry: false }
);
```

## Cache Invalidation Strategies

### Invalidate Everything

```typescript
queryClient.invalidateQueries();
```

### Invalidate by Key

```typescript
// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

// Invalidate only user lists
queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
```

### Update Cache Directly

```typescript
// Optimistic update
queryClient.setQueryData(
  queryKeys.users.detail(userId),
  updatedUser
);

// Remove from cache
queryClient.removeQueries({
  queryKey: queryKeys.users.detail(userId),
});
```

## Adding New Features

### 1. Create Service File

```typescript
// lib/api/features/posts/service.ts
export const postService = {
  getPosts: async (apiClient, params) => { /* ... */ },
  createPost: async (apiClient, data) => { /* ... */ },
};
```

### 2. Add Query Keys

```typescript
// lib/api/config/query-keys.ts
export const queryKeys = {
  // ... existing
  posts: {
    all: ["posts"],
    lists: () => [...queryKeys.posts.all, "list"],
    list: (filters) => [...queryKeys.posts.lists(), filters],
  },
};
```

### 3. Create Hooks

```typescript
// lib/api/features/posts/queries.ts
export function useGetPosts(params?, options?) {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: async () => postService.getPosts(apiClient, params),
    enabled: !!apiClient,
    ...options,
  });
}
```

### 4. Export

```typescript
// lib/api/features/posts/index.ts
export * from "./service";
export * from "./queries";
export * from "./mutations";
```

## Best Practices

✅ **Do:**
- Keep query keys hierarchical for easy invalidation
- Use service functions for business logic
- Handle loading and error states
- Use optimistic updates for better UX
- Enable automatic refetching strategically
- Type your API responses
- Use enabled flag to control query execution
- Combine queries using useQueries for parallel requests

❌ **Don't:**
- Put API calls directly in components
- Mix service logic with hooks
- Hardcode query keys
- Ignore error states
- Use complex logic in component render
- Make multiple requests when one could do
- Over-refetch with short intervals

## Performance Optimization

### Parallel Requests

```tsx
import { useQueries } from "@tanstack/react-query";

const results = useQueries({
  queries: [
    { queryKey: queryKeys.users.detail("1"), queryFn: () => /* ... */ },
    { queryKey: queryKeys.dashboard.stats(), queryFn: () => /* ... */ },
  ],
});
```

### Pagination

```tsx
const [page, setPage] = useState(1);
const { data } = useGetUsers({ page, limit: 10 });

// Data is cached for each page
```

### Infinite Queries (Load More)

```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useGetUsersInfinite({ limit: 10 });

const handleLoadMore = () => fetchNextPage();
```

## Debugging

Add React Query DevTools:

```tsx
// In your root layout or provider
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

Then access DevTools at bottom-right corner (development only).

## Error Handling

```tsx
const { data, isError, error } = useGetUsers();

if (isError) {
  return <div>Error: {error?.message || "Unknown error"}</div>;
}
```

With custom error handler in mutation:

```tsx
const { mutate } = useCreateUser({
  onError: (error) => {
    console.error("Creation failed:", error);
    // Show toast notification
    toast.error("Failed to create user");
  },
});
```

## Files Reference

| File | Purpose |
|------|---------|
| `lib/api/config/query-keys.ts` | Centralized query key definitions |
| `lib/api/config/query-client.ts` | QueryClient configuration |
| `lib/api/features/users/service.ts` | API service functions |
| `lib/api/features/users/queries.ts` | Query hooks |
| `lib/api/features/users/mutations.ts` | Mutation hooks |
| `lib/providers/ReactQueryProvider.tsx` | QueryClientProvider wrapper |
| `lib/api/examples/*.tsx` | Usage examples |

## Next Steps

1. Update `.env.local` with your API URL
2. Add more features following the same pattern
3. Update API service functions with your endpoints
4. Add error handling as needed
5. Test with React Query DevTools
