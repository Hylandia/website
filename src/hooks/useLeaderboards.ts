import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/auth-api";
import type { LeaderboardsData } from "@/types/leaderboards";

export function useLeaderboards() {
  return useQuery<LeaderboardsData>({
    queryKey: ["leaderboards"],
    queryFn: async () => {
      const response = await authAPI.getLeaderboards();
      return response.data!;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
