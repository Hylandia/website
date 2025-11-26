import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp } from "lucide-react";

interface RankingCardProps {
  rankings: {
    overall: { rank: number; percentile: number };
    kills: { rank: number; percentile: number };
    playtime: { rank: number; percentile: number };
  };
}

export function RankingCard({ rankings }: RankingCardProps) {
  const rankingData = [
    {
      label: "Overall",
      icon: Trophy,
      rank: rankings.overall.rank,
      percentile: rankings.overall.percentile,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
    },
    {
      label: "Kills",
      icon: Medal,
      rank: rankings.kills.rank,
      percentile: rankings.kills.percentile,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
    {
      label: "Playtime",
      icon: TrendingUp,
      rank: rankings.playtime.rank,
      percentile: rankings.playtime.percentile,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {rankingData.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 ${item.bg} border ${item.border} rounded-lg text-center`}
          >
            <Icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
            <h4 className="font-bold text-white mb-2">{item.label}</h4>
            <p className={`text-2xl font-bold ${item.color} mb-1`}>
              #{item.rank.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-400">
              Top {item.percentile}% of players
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
