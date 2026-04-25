# React Query Setup Guide

## Installation

```bash
npm install @tanstack/react-query
```

Optional (for development):
```bash
npm install -D @tanstack/react-query-devtools
```

## Quick Start

### 1. Provider Setup (Already Done ✓)

The `ReactQueryProvider` is already integrated in `app/layout.tsx`:

```tsx
import { ReactQueryProvider } from "@/lib/providers";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <ClientProvider>{children}</ClientProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
```

### 2. Use Queries in Components

```tsx
"use client";

import { useGetUsers } from "@/lib/api/features/users";

export function UsersList() {
  const { data, isLoading, error } = useGetUsers({ page: 1 });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  
  return (
    <div>
      {data?.data.map(user => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}
```

### 3. Use Mutations for Write Operations

```tsx
import { useCreateUser } from "@/lib/api/features/users";

export function CreateUserForm() {
  const { mutate: createUser, isPending } = useCreateUser({
    onSuccess: () => alert("User created!"),
  });

  return (
    <button 
      onClick={() => createUser({ 
        email: "user@example.com",
        first_name: "John",
        last_name: "Doe",
        role: "app_user"
      })}
      disabled={isPending}
    >
      {isPending ? "Creating..." : "Create User"}
    </button>
  );
}
```

## Configuration

Default settings in `lib/api/config/query-client.ts`:
- **Stale Time**: 5 minutes (data becomes stale after 5 min)
- **Cache Time**: 10 minutes (data removed from cache after 10 min)
- **Retry**: 3 times with exponential backoff
- **Retry Delay**: Up to 30 seconds

Override per-hook:
```tsx
useGetUsers(params, { 
  staleTime: 1000 * 60 * 10,  // 10 minutes
  gcTime: 1000 * 60 * 20,     // 20 minutes
  retry: false
})
```

## File Structure

```
lib/api/
├── config/
│   ├── query-keys.ts       # Query key definitions
│   └── query-client.ts     # QueryClient config
├── features/
│   ├── users/
│   │   ├── service.ts      # API functions
│   │   ├── queries.ts      # useQuery hooks
│   │   ├── mutations.ts    # useMutation hooks
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── service.ts
│   │   ├── queries.ts
│   │   └── index.ts
│   └── index.ts
├── examples/               # Usage examples
└── index.ts
```

## Adding New Features

### Step 1: Create Service

`lib/api/features/products/service.ts`:
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
}

export const productService = {
  getProducts: async (apiClient, params) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },
  
  getProductById: async (apiClient, id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (apiClient, data) => {
    const response = await apiClient.post("/products", data);
    return response.data;
  },
};
```

### Step 2: Add Query Keys

`lib/api/config/query-keys.ts`:
```typescript
export const queryKeys = {
  // ... existing
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id) => [...queryKeys.products.details(), id] as const,
  },
};
```

### Step 3: Create Queries

`lib/api/features/products/queries.ts`:
```typescript
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { productService } from "./service";
import { useApiClient } from "@/lib/hooks/useApiClient";

export function useGetProducts(params?, options?) {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: async () => productService.getProducts(apiClient, params),
    enabled: !!apiClient,
    ...options,
  });
}

export function useGetProductById(id, options?) {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => productService.getProductById(apiClient, id),
    enabled: !!apiClient && !!id,
    ...options,
  });
}
```

### Step 4: Create Mutations

`lib/api/features/products/mutations.ts`:
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { productService } from "./service";
import { useApiClient } from "@/lib/hooks/useApiClient";

export function useCreateProduct(options?) {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => productService.createProduct(apiClient, data),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      });
      queryClient.setQueryData(
        queryKeys.products.detail(newProduct.id),
        newProduct
      );
    },
    ...options,
  });
}
```

### Step 5: Export

`lib/api/features/products/index.ts`:
```typescript
export * from "./service";
export * from "./queries";
export * from "./mutations";
```

## Common Patterns

### Infinite Queries (Load More)

```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useGetUsersInfinite({ limit: 10 });

return (
  <>
    {data?.pages.map(page =>
      page.data.map(user => <div key={user.id}>{user.email}</div>)
    )}
    {hasNextPage && (
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        Load More
      </button>
    )}
  </>
);
```

### Optimistic Updates

```tsx
const { mutate } = useMutation({
  mutationFn: async (data) => api.update(data),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.users.lists() });
    
    // Snapshot previous state
    const previousUsers = queryClient.getQueryData(queryKeys.users.lists());
    
    // Optimistically update cache
    queryClient.setQueryData(queryKeys.users.lists(), (old) => [
      ...old,
      newData,
    ]);
    
    return { previousUsers };
  },
  onError: (err, newData, context) => {
    // Rollback to previous state on error
    queryClient.setQueryData(
      queryKeys.users.lists(),
      context?.previousUsers
    );
  },
});
```

### Dependent Queries

```tsx
const { data: user } = useGetUserById(userId);

// This query only runs when userId is available
const { data: profile } = useGetUserProfile(
  user?.id,
  { enabled: !!user?.id }
);
```

## Debugging

Enable React Query DevTools in development:

```tsx
// lib/providers/ReactQueryProvider.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ReactQueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

Then check the DevTools panel (bottom-right) to:
- View all queries and their state
- Inspect cache
- Trigger refetch
- See dependencies
- Monitor performance

## Troubleshooting

### Query returns undefined

```tsx
// ❌ Wrong
const { data } = useGetUsers();
data.map(user => ...) // Error if data is undefined

// ✅ Right
const { data = [], isLoading } = useGetUsers();
if (isLoading) return <div>Loading...</div>;
data.map(user => ...)
```

### Mutation not working

Check if:
- API client is available (`enabled: !!apiClient`)
- Authorization token is set correctly
- API endpoint is correct
- Request body matches API expectations

### Stale data not updating

```tsx
// Force fresh data
const { data, refetch } = useGetUsers({
  staleTime: 0, // Always stale
});

// Or manually refetch
<button onClick={() => refetch()}>Refresh</button>
```

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [React Query Examples](https://tanstack.com/query/latest/docs/react/examples)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/overview)

## Next Steps

1. ✅ Install @tanstack/react-query
2. ✅ Review query structure
3. ✅ Add your API endpoints
4. ✅ Create features following the pattern
5. ✅ Test with DevTools
6. ✅ Deploy with confidence!
