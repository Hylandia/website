"use client";

import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";
import { authKeys } from "./useUser";

export function useSessions() {
  return useQuery({
    queryKey: authKeys.sessions(),
    queryFn: async () => {
      const response = await authAPI.getSessions();
      return response.data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
