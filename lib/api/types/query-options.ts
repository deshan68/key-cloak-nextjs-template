/**
 * Reusable Query Options Types
 * Type utilities for React Query hook options
 */
import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";

/**
 * Reusable type for useQuery hook options
 * Excludes queryKey and queryFn which are provided by the hook
 *
 * Usage:
 * ```typescript
 * export function useGetUsers(
 *   params?: UserFilters,
 *   options?: UseQueryOptionsWithoutKeyAndFn<UsersListResponse>,
 * ) { ... }
 * ```
 */
export type UseQueryOptionsWithoutKeyAndFn<
  TData = unknown,
  TError = Error,
> = Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">;

/**
 * Reusable type for useMutation hook options
 * Excludes mutationFn which is provided by the hook
 *
 * Usage:
 * ```typescript
 * export function useCreateUser(
 *   options?: UseMutationOptionsWithoutFn<User, CreateUserRequest>,
 * ) { ... }
 * ```
 */
export type UseMutationOptionsWithoutFn<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
