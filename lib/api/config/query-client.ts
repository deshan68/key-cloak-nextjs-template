import { QueryClient } from "@tanstack/react-query";

/**
 * Configure React Query client with default options
 * Provides sensible defaults for queries and mutations
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 minutes
        staleTime: 1000 * 60 * 5,
        // Cache time: 10 minutes
        gcTime: 1000 * 60 * 10,
        // Retry failed requests 3 times with exponential backoff
        retry: 3,
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations once by default
        retry: 1,
        retryDelay: 500,
      },
    },
  });
};
