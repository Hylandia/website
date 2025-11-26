import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Swords, Clock } from "lucide-react";
import { useLeaderboards } from "@/hooks/useLeaderboards";
import { LeaderboardTable } from "@/components/leaderboards/LeaderboardTable";

type LeaderboardTab = "overall" | "kills" | "playtime";

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("overall");
  const { data, isLoading, error } = useLeaderboards();

  const tabs = [
    {
      id: "overall" as const,
      label: "Overall",
      icon: Trophy,
      color: "text-yellow-400",
      activeColor: "bg-yellow-500/20 border-yellow-500/50",
    },
    {
      id: "kills" as const,
      label: "Kills",
      icon: Swords,
      color: "text-red-400",
      activeColor: "bg-red-500/20 border-red-500/50",
    },
    {
      id: "playtime" as const,
      label: "Playtime",
      icon: Clock,
      color: "text-purple-400",
      activeColor: "bg-purple-500/20 border-purple-500/50",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-white/60">Loading leaderboards...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-500/10 border-2 border-red-500 p-6 text-center">
            <p className="text-red-500 font-bold uppercase tracking-wider">
              Failed to load leaderboards
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overall, kills, playtime } = data;

  return (
    <div className="min-h-screen bg-neutral pt-20 pb-12 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(190,95,87,0.5)]" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-wider">
                Leaderboards
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Top players across all game modes
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 sm:gap-4 mb-8 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-2 transition-all ${
                    isActive
                      ? tab.activeColor
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${tab.color}`} />
                  <span className="font-bold text-white uppercase tracking-wide">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Leaderboard Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-800/80 backdrop-blur-xl border-2 border-primary/20 p-4 sm:p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_20px_25px_-5px_rgba(0,0,0,0.7)]"
        >
          {activeTab === "overall" && (
            <LeaderboardTable type="overall" entries={overall} />
          )}
          {activeTab === "kills" && (
            <LeaderboardTable type="kills" entries={kills} />
          )}
          {activeTab === "playtime" && (
            <LeaderboardTable type="playtime" entries={playtime} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
