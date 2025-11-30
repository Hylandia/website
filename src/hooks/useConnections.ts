import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";

export function useConnections() {
  return useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const response = await authAPI.getConnections();
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
