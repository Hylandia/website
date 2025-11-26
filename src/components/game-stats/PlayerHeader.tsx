import { motion } from "framer-motion";
import { User, Clock, Calendar } from "lucide-react";

interface PlayerHeaderProps {
  username: string;
  displayName: string;
  level: number;
  experience: number;
  firstJoined: string;
  lastSeen: string;
  totalPlaytime: number;
}

export function PlayerHeader({
  username,
  displayName,
  level,
  experience,
  firstJoined,
  lastSeen,
  totalPlaytime,
}: PlayerHeaderProps) {
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

  // Calculate XP for current level (simplified progression)
  const xpForLevel = (lvl: number) => Math.floor(100 * Math.pow(1.5, lvl - 1));
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpProgress =
    ((experience - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Player Info */}
      <div className="mb-6 p-6 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {displayName}
            </h2>
            <p className="text-sm text-neutral-300">@{username}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-primary mb-1">
              <User className="w-5 h-5" />
              <span className="text-xl font-bold">Level {level}</span>
            </div>
            <p className="text-xs text-neutral-400">
              {experience.toLocaleString()} XP
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400">
              Progress to Level {level + 1}
            </span>
            <span className="text-xs text-neutral-400">
              {Math.round(xpProgress)}%
            </span>
          </div>
          <div className="w-full bg-neutral-900/50 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-neutral-400">Playtime</p>
            </div>
            <p className="text-sm font-bold text-purple-400">
              {formatPlaytime(totalPlaytime)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-neutral-400">Joined</p>
            </div>
            <p className="text-sm font-bold text-blue-400">
              {formatDate(firstJoined)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-green-400" />
              <p className="text-xs text-neutral-400">Last Seen</p>
            </div>
            <p className="text-sm font-bold text-green-400">
              {formatDate(lastSeen)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
