"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";
import { authKeys } from "./useUser";

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authAPI.revokeSession(sessionId),
    onSuccess: () => {
      // Refetch sessions list
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });
}
