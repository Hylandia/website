"use client";

import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  sessions: () => [...authKeys.all, "sessions"] as const,
};

export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        const response = await authAPI.getCurrentUser();
        return response.data;
      } catch (error) {
        // User not authenticated
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
