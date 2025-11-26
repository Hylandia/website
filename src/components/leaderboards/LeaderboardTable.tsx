import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import type {
  OverallLeaderboardEntry,
  KillsLeaderboardEntry,
  PlaytimeLeaderboardEntry,
} from "@/types/leaderboards";

interface LeaderboardTableProps {
  type: "overall" | "kills" | "playtime";
  entries:
    | OverallLeaderboardEntry[]
    | KillsLeaderboardEntry[]
    | PlaytimeLeaderboardEntry[];
}

export function LeaderboardTable({ type, entries }: LeaderboardTableProps) {
  const formatPlaytime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-neutral-400">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500/30";
      case 2:
        return "bg-gray-500/10 border-gray-500/30";
      case 3:
        return "bg-amber-500/10 border-amber-500/30";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.uuid}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-4 border ${getRankBg(
            entry.rank
          )} rounded-lg flex items-center justify-between`}
        >
          <div className="flex items-center gap-4">
            <div className="w-8 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>
            <div>
              <p className="font-bold text-white">{entry.displayName}</p>
              <p className="text-sm text-neutral-400">@{entry.username}</p>
            </div>
          </div>

          <div className="text-right">
            {type === "overall" && "level" in entry && (
              <>
                <p className="text-xl font-bold text-primary">
                  Level {entry.level}
                </p>
                <p className="text-sm text-neutral-400">
                  {entry.experience.toLocaleString()} XP
                </p>
              </>
            )}

            {type === "kills" && "playerKills" in entry && (
              <>
                <p className="text-xl font-bold text-red-400">
                  {entry.playerKills.toLocaleString()} Kills
                </p>
                <p className="text-sm text-neutral-400">
                  K/D: {entry.killDeathRatio.toFixed(2)}
                </p>
              </>
            )}

            {type === "playtime" && "totalPlaytime" in entry && (
              <>
                <p className="text-xl font-bold text-purple-400">
                  {formatPlaytime(entry.totalPlaytime)}
                </p>
                <p className="text-sm text-neutral-400">
                  Since {formatDate(entry.firstJoined)}
                </p>
              </>
            )}
          </div>
        </motion.div>
      ))}

      {entries.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          No leaderboard data available
        </div>
      )}
    </div>
  );
}
