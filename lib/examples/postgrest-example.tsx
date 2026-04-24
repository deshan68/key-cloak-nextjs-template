"use client";

import { usePostgrestClient, usePostgrestClientReady } from "@/lib/hooks/usePostgrestClient";
import { useState, useEffect } from "react";

/**
 * Example: Using Postgrest client in a React component
 * This demonstrates how to query data from a PostgreSQL table via PostgREST
 */
export function PostgrestExample() {
  const postgrestClient = usePostgrestClient();
  const isReady = usePostgrestClientReady();
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !postgrestClient) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Example: Query users table
        const { data, error: postgrestError } = await postgrestClient
          .from("users") // Replace with your table name
          .select("*")
          .limit(10);

        if (postgrestError) {
          throw postgrestError;
        }

        setData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postgrestClient, isReady]);

  if (!isReady) {
    return <div>Loading authentication...</div>;
  }

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <h3>Postgrest Client Example</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
