import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";
import type { PlayerStats } from "@/types/player-stats";

export function usePlayerStats() {
  return useQuery<PlayerStats | null>({
    queryKey: ["playerStats"],
    queryFn: async () => {
      const response = await authAPI.getPlayerStats();

      return response.success ? response.data : null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
