# API Response Validation with Zod

This document explains how Zod validation is integrated into the API layer to ensure type safety and data integrity for all API responses.

## Overview

Zod schemas are used to validate API responses at runtime, ensuring that data coming from the server matches the expected shape before being used in the application. This provides:

- **Runtime Type Safety**: Catches API response mismatches before they cause runtime errors
- **Data Integrity**: Validates data format, types, and constraints
- **Clear Error Messages**: Provides detailed validation error information
- **Type Inference**: Generates TypeScript types from schemas automatically

## Architecture

```
API Response Flow:
┌─────────────────────────────────────────────────────────────┐
│ PostgreSQL/API Server                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ Raw API Response
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Service Layer (service.ts)                                  │
│ - Receives raw data                                         │
│ - Validates with Zod schemas                               │
│ - Maps to domain model if valid                            │
│ - Throws on validation failure                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ Validated & Mapped Data
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ React Query Hooks (queries.ts, mutations.ts)               │
│ - Receives validated data                                   │
│ - Cache management                                          │
│ - Error handling                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ Guaranteed Valid Data
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Components                                                  │
│ - Type-safe usage                                           │
│ - No runtime validation needed                              │
└─────────────────────────────────────────────────────────────┘
```

## Schema Organization

### User Validators

Location: `lib/api/features/users/user.validators.ts`

**Schemas**:
- `ApiUserSchema` - Validates raw API response (snake_case)
- `UserSchema` - Validates mapped domain model (camelCase)
- `UsersListResponseSchema` - Validates paginated list response
- `CreateUserRequestSchema` - Validates create request payload
- `UpdateUserRequestSchema` - Validates update request payload
- `UserFiltersSchema` - Validates filter parameters

**Example**:
```typescript
// Raw API response
const apiResponse = {
  id: "uuid-123",
  email: "user@example.com",
  first_name: "John",
  last_name: "Doe",
  role: "app_user",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

// Validate against schema
const validation = UserSafeValidators.safeParseUser(apiResponse);
if (validation.success) {
  console.log("Valid API user:", validation.data);
} else {
  console.error("Validation errors:", validation.error.issues);
}
```

### Dashboard Validators

Location: `lib/api/features/dashboard/validators.ts`

**Schemas**:
- `DashboardStatsSchema` - Validates dashboard statistics
- `DashboardActivitySchema` - Validates individual activity record
- `DashboardOverviewSchema` - Validates complete overview with stats and activities
- `DashboardActivityFiltersSchema` - Validates activity filter parameters

## Integration in Service Layer

### Pattern: Validate After API Call

All service functions follow this pattern:

```typescript
export const userService = {
  getUserById: async (
    apiClient: PostgrestClient,
    userId: string,
  ): Promise<User> => {
    // 1. Make API call
    const { data, error } = await apiClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    // 2. Validate API response
    const validation = UserSafeValidators.safeParseUser(data);
    if (!validation.success) {
      console.error("User validation error:", validation.error);
      throw new Error(`Invalid user data: ${validation.error.message}`);
    }

    // 3. Map to domain model
    return userMapper.toDomain(validation.data);
  },
};
```

### Key Steps

1. **API Call**: Fetch data from Postgrest client
2. **Error Handling**: Check for API errors
3. **Validation**: Parse response against schema
4. **Error Logging**: Log validation errors
5. **Mapping**: Transform to domain model
6. **Return**: Pass validated data to hooks

## Validation Methods

### Safe Parsing (Recommended)

Returns result object, doesn't throw:

```typescript
const result = UserSafeValidators.safeParseUser(data);

if (result.success) {
  // result.data is type-safe
  const user: ValidatedUser = result.data;
} else {
  // result.error contains validation details
  console.error(result.error.issues);
}
```

### Validator Utilities

Provides structured error responses:

```typescript
const result = UserValidators.validateApiUser(data);

// Returns: { success: boolean, data?: T, error?: ZodIssue[], message?: string }
if (result.success) {
  processUser(result.data);
} else {
  handleErrors(result.error, result.message);
}
```

## Error Handling

### Validation Errors

When validation fails, detailed error information is available:

```typescript
const validation = UserSafeValidators.safeParseUser(badData);

if (!validation.success) {
  validation.error.issues.forEach((issue) => {
    console.error(
      `Field: ${issue.path.join(".")}, ` +
      `Code: ${issue.code}, ` +
      `Message: ${issue.message}`
    );
  });
}
```

Example error output:
```
Field: email, Code: invalid_string, Message: Invalid email
Field: role, Code: invalid_enum_value, Message: Invalid enum value
```

### API Response Mismatch

If API response structure changes unexpectedly:

```typescript
// Old API: { email: "user@example.com" }
// New API: { emailAddress: "user@example.com" }
// Result: Validation error - "email" field is required
```

This prevents silent failures and makes schema drift visible immediately.

## Common Patterns

### Single User Fetch

```typescript
const { data, error } = await apiClient
  .from("users")
  .select("*")
  .eq("id", userId)
  .single();

if (error) throw error;

const validation = UserSafeValidators.safeParseUser(data);
if (!validation.success) {
  throw new Error("Invalid user data");
}

return userMapper.toDomain(validation.data);
```

### List with Validation Loop

```typescript
const { data, error } = await query;
if (error) throw error;

// Validate each item in array
if (data && Array.isArray(data)) {
  for (const item of data) {
    const validation = UserSafeValidators.safeParseUser(item);
    if (!validation.success) {
      throw new Error("Invalid user in list");
    }
  }
}

const mappedData = (data || []).map((user) => userMapper.toDomain(user));
return mappedData;
```

### Conditional Validation

```typescript
const stats = DashboardSafeValidators.safeParseStats(data);
if (!stats.success) {
  // Log but don't throw - use default values
  console.warn("Stats validation failed:", stats.error.issues);
  return getDefaultStats();
}
return stats.data;
```

## Schema Definition Examples

### Simple Object

```typescript
export const DashboardStatsSchema = z.object({
  total_users: z.number().int().nonnegative(),
  total_admins: z.number().int().nonnegative(),
  new_users_today: z.number().int().nonnegative(),
  active_sessions: z.number().int().nonnegative(),
});
```

### With Custom Messages

```typescript
export const UserSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["app_user", "app_admin"]),
});
```

### Optional Fields

```typescript
export const UpdateUserRequestSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  role: z.enum(["app_user", "app_admin"]).optional(),
});
```

### Array Validation

```typescript
export const ActivitiesSchema = z.array(
  z.object({
    id: z.string().uuid(),
    action: z.string(),
    timestamp: z.string().datetime(),
  })
);
```

## Type Inference

Zod automatically generates TypeScript types:

```typescript
// Define schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

// Infer type
export type ValidatedUser = z.infer<typeof UserSchema>;

// Same as manually writing:
// type ValidatedUser = {
//   id: string;
//   email: string;
// };
```

## Testing Validation

### Unit Tests Example

```typescript
import { UserSafeValidators } from "./user.validators";

describe("User Validators", () => {
  it("should validate valid user data", () => {
    const validUser = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com",
      first_name: "John",
      last_name: "Doe",
      role: "app_user",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const result = UserSafeValidators.safeParseUser(validUser);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalidUser = {
      ...validUser,
      email: "not-an-email",
    };

    const result = UserSafeValidators.safeParseUser(invalidUser);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].code).toBe("invalid_string");
  });

  it("should reject invalid role", () => {
    const invalidUser = {
      ...validUser,
      role: "super_admin", // Invalid role
    };

    const result = UserSafeValidators.safeParseUser(invalidUser);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].code).toBe("invalid_enum_value");
  });
});
```

## Adding Validation to New Features

To add validation to a new API feature:

1. **Create validators file**:
   ```bash
   touch lib/api/features/[feature]/validators.ts
   ```

2. **Define schemas**:
   ```typescript
   import { z } from "zod";
   
   export const FeatureResponseSchema = z.object({
     id: z.string().uuid(),
     name: z.string().min(1),
     // ... more fields
   });
   
   export type ValidatedFeatureResponse = z.infer<
     typeof FeatureResponseSchema
   >;
   ```

3. **Integrate in service**:
   ```typescript
   import { FeatureSafeValidators } from "./validators";
   
   export const featureService = {
     getFeature: async (...): Promise<FeatureResponse> => {
       const { data, error } = await apiClient.from("features")...
       if (error) throw error;
       
       const validation = FeatureSafeValidators.safeParse(data);
       if (!validation.success) {
         throw new Error("Invalid feature data");
       }
       
       return validation.data;
     },
   };
   ```

4. **Export from index.ts**:
   ```typescript
   export * from "./validators";
   ```

## Best Practices

### ✅ DO

- Validate immediately after API call
- Use `safeParse` for non-critical data
- Log validation errors for debugging
- Throw on validation failure for critical operations
- Keep schemas close to service functions
- Use custom error messages
- Validate array items individually
- Type-check inferred types

### ❌ DON'T

- Skip validation of external data
- Use `parse()` without try-catch
- Suppress validation errors silently
- Trust API responses without validation
- Define duplicate schemas
- Mix Zod and TypeScript interface definitions
- Validate in components (validate in service layer)

## Performance Considerations

### Validation Overhead

Zod validation adds minimal overhead:
- ~0.1-0.5ms per validation for typical objects
- Negligible compared to network request time
- Caching is handled by React Query

### Optimization Tips

```typescript
// Cache schema instances (already done in validators.ts)
export const UserSafeValidators = {
  safeParseUser: (data: unknown) => UserSchema.safeParse(data),
};

// Validate only once at service level
// Don't re-validate in hooks or components
```

## Debugging

### Enable Verbose Logging

```typescript
const validation = UserSafeValidators.safeParseUser(data);
if (!validation.success) {
  console.error("Validation Issues:", {
    count: validation.error.issues.length,
    issues: validation.error.issues,
    data: data, // Include received data
  });
}
```

### Schema Mismatch Detective

When validation fails unexpectedly:

```typescript
// 1. Check actual data structure
console.log("Received data:", JSON.stringify(data, null, 2));

// 2. Check schema definition
console.log("Expected schema:", UserSchema.describe());

// 3. Compare field by field
const validation = UserSafeValidators.safeParseUser(data);
if (!validation.success) {
  validation.error.issues.forEach((issue) => {
    console.log(
      `Missing/Invalid field: ${issue.path.join(".")}`,
      `Expected: ${issue.expected}`,
      `Got: ${issue.received}`
    );
  });
}
```

## Troubleshooting

### "Property 'errors' does not exist on type 'ZodError'"

Use `error.issues` instead of `error.errors`:

```typescript
// ❌ Wrong
error.errors

// ✅ Correct
error.issues
```

### Validation Always Fails

Check schema field names match API response:

```typescript
// API returns: { first_name: "John" }
// Schema should define: z.object({ first_name: ... })
// NOT: z.object({ firstName: ... })
```

### Type-safety Lost After Validation

Always use type inference:

```typescript
// ❌ Don't lose type safety
const data: any = validation.data;

// ✅ Use inferred types
type ValidatedUser = z.infer<typeof UserSchema>;
const data: ValidatedUser = validation.data;
```

## Related Documentation

- [TYPE_SYSTEM.md](./TYPE_SYSTEM.md) - Overall API layer architecture
- [Zod Documentation](https://zod.dev) - Complete Zod guide
- [API Error Handling](./ERROR_HANDLING.md) - Error handling patterns
