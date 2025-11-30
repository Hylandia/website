import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";
import type { OAuthProvider } from "@/types/connections";

export function useRemoveConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: OAuthProvider) => {
      const response = await authAPI.removeConnection(provider);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate connections query to refetch
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
}
