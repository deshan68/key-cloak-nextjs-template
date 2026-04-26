# Constants Management Guide

This document outlines the strategy for managing constants across this Next.js application.

## Directory Structure

```
lib/
├── constants/                    # Global constants (shared across app)
│   ├── index.ts                 # Central export point
│   └── global.ts                # Global constants (APP, API, AUTH, etc.)
├── config/
│   ├── env.ts                   # Environment variables (type-safe)
│   └── query-keys.ts            # React Query key factory
└── api/
    └── features/
        ├── users/
        │   ├── user.constants.ts    # User feature constants
        │   ├── user.schemas.ts
        │   ├── user.types.ts
        │   └── ...
        └── dashboard/
            ├── dashboard.constants.ts # Dashboard feature constants
            └── ...
```

## Constant Categories

### 1. **Global Constants** (`lib/constants/global.ts`)

Shared across the entire application:
- App metadata (name, version)
- API configuration (timeout, retry settings)
- Authentication config
- Common user roles
- Pagination defaults
- HTTP status codes
- Error/success messages
- Storage keys
- Date formats
- Routes

**Import:**
```typescript
import { APP_CONFIG, API_CONFIG, ROUTES, USER_ROLES } from "@/lib/constants";
```

### 2. **Feature-Specific Constants** (`lib/api/features/[feature]/[feature].constants.ts`)

Scoped to a particular feature:
- Feature-specific enums (roles, statuses, types)
- Feature error/success messages
- Feature API endpoints
- Feature validation rules
- Feature pagination settings
- Feature messages and labels

**Import:**
```typescript
import { USER_ROLES_CONFIG, USERS_MESSAGES } from "@/lib/api/features/users/user.constants";
import { ACTIVITY_TYPES, DASHBOARD_METRICS } from "@/lib/api/features/dashboard/dashboard.constants";
```

### 3. **Environment Variables** (`lib/config/env.ts`)

Type-safe environment configuration:
- Application environment (dev/prod/test)
- API endpoints and keys
- Database credentials
- Authentication providers
- Feature flags

**Import:**
```typescript
import { env, isDevelopment, isProduction } from "@/lib/config/env";

const apiUrl = env.NEXT_PUBLIC_POSTGREST_URL;
if (isDevelopment) {
  // Dev-specific logic
}
```

### 4. **Query Keys** (`lib/config/query-keys.ts`)

TanStack Query key factory for caching:
- Hierarchical query key structure
- Feature-based organization

**Import:**
```typescript
import { queryKeys } from "@/lib/config/query-keys";

useQuery({
  queryKey: queryKeys.users.list({ role: "admin" }),
  queryFn: () => fetchUsers(),
});
```

## Best Practices

### ✅ DO

1. **Use `as const`** for immutability and type inference
   ```typescript
   export const USER_ROLES = {
     admin: "app_admin",
     user: "app_user",
   } as const;
   ```

2. **Group related constants** together logically
   ```typescript
   export const USER_VALIDATION = {
     username: { minLength: 3, maxLength: 50 },
     email: { minLength: 5, maxLength: 255 },
   } as const;
   ```

3. **Use SCREAMING_SNAKE_CASE** for constant object names
   ```typescript
   export const ERROR_MESSAGES = { ... };
   export const SUCCESS_MESSAGES = { ... };
   ```

4. **Add JSDoc comments** explaining the purpose
   ```typescript
   /**
    * User role enumeration
    * Maps role values to their string identifiers
    */
   export const USER_ROLES = { ... };
   ```

5. **Extract types** for reusability
   ```typescript
   export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
   export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];
   ```

6. **Keep feature constants** in feature directories
   ```
   lib/api/features/users/user.constants.ts
   lib/api/features/dashboard/dashboard.constants.ts
   ```

7. **Validate environment variables** with Zod schema
   ```typescript
   const env = EnvironmentSchema.safeParse(process.env);
   if (!env.success) throw new Error("Invalid env vars");
   ```

### ❌ DON'T

1. **Don't hardcode values** in components/services
   ```typescript
   // ❌ BAD
   const timeout = 30000;
   
   // ✅ GOOD
   import { API_CONFIG } from "@/lib/constants";
   const timeout = API_CONFIG.timeout;
   ```

2. **Don't mix global and feature constants** unnecessarily
   ```typescript
   // ❌ BAD - Put feature-specific constants in feature file
   export const USERS_PAGE_SIZE = 10; // in global.ts
   
   // ✅ GOOD
   // in lib/api/features/users/user.constants.ts
   export const USERS_PAGINATION = { defaultLimit: 10 };
   ```

3. **Don't use magic strings** for error/success messages
   ```typescript
   // ❌ BAD
   throw new Error("Failed to fetch user");
   
   // ✅ GOOD
   import { USERS_MESSAGES } from "@/lib/api/features/users/user.constants";
   throw new Error(USERS_MESSAGES.errors.fetchFailed);
   ```

4. **Don't commit `.env.local`** to version control
   - Use `.env.example` as template
   - Only commit `.env.example`

5. **Don't expose secrets** to the client
   ```typescript
   // ❌ BAD
   NEXT_PUBLIC_API_SECRET_KEY=... // NEVER!
   
   // ✅ GOOD
   NEXT_PUBLIC_API_URL=...           // Client-side (safe)
   API_SECRET_KEY=...                 // Server-side only
   ```

## Usage Examples

### Global Constants

```typescript
import { APP_CONFIG, ROUTES, ERROR_MESSAGES } from "@/lib/constants";

export default function Layout() {
  return (
    <div>
      <h1>{APP_CONFIG.name}</h1>
      <nav>
        <Link href={ROUTES.dashboard}>Dashboard</Link>
        <Link href={ROUTES.createUser}>Create User</Link>
      </nav>
    </div>
  );
}
```

### Feature Constants

```typescript
import { USER_ROLES_CONFIG, USERS_MESSAGES } from "@/lib/api/features/users/user.constants";
import type { UserRoleType } from "@/lib/api/features/users/user.constants";

export async function createUser(userData: any) {
  try {
    if (!Object.values(USER_ROLES_CONFIG).includes(userData.role)) {
      throw new Error(USERS_MESSAGES.errors.invalidCredentials);
    }
    // create user...
    return { success: true, message: USERS_MESSAGES.success.created };
  } catch (error) {
    return { success: false, message: USERS_MESSAGES.errors.createFailed };
  }
}
```

### Environment Variables

```typescript
import { env, isDevelopment } from "@/lib/config/env";

const apiClient = createClient({
  url: env.NEXT_PUBLIC_POSTGREST_URL,
  apiKey: env.NEXT_PUBLIC_POSTGREST_ANON_KEY,
  timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  debug: isDevelopment,
});
```

### Query Keys with Constants

```typescript
import { queryKeys } from "@/lib/config/query-keys";
import { USER_ROLES_CONFIG } from "@/lib/api/features/users/user.constants";

export function useUsersList() {
  return useQuery({
    queryKey: queryKeys.users.list({
      role: USER_ROLES_CONFIG.admin,
    }),
    queryFn: () => fetchUsers(),
  });
}
```

## When to Create New Constants

Create a new constant when:
- ✅ Value is repeated in 2+ places
- ✅ Value is a configuration that might change
- ✅ Value needs type safety
- ✅ Value is a magic string/number
- ✅ Value is feature-specific behavior

Don't create a constant when:
- ❌ Used only once
- ❌ It's a simple calculation or transformation
- ❌ It's instance-specific data (user input, API response)

## Migration from Hardcoded Values

When refactoring existing code, move hardcoded values to constants:

```typescript
// BEFORE
const users = await api.get("/app_user?limit=10&offset=0");
if (users.length === 0) {
  throw new Error("No users found");
}

// AFTER
import { USERS_PAGINATION } from "@/lib/api/features/users/user.constants";
import { USERS_MESSAGES } from "@/lib/api/features/users/user.constants";

const users = await api.get(
  `/app_user?limit=${USERS_PAGINATION.defaultLimit}&offset=0`
);
if (users.length === 0) {
  throw new Error(USERS_MESSAGES.errors.fetchFailed);
}
```

## Maintenance

- Review constants quarterly
- Remove unused constants
- Update messages for clarity
- Add new features' constants proactively
- Keep `env.ts` validation schema in sync with actual requirements
