"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  TrendingUp,
  Star,
  Award,
  Zap,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";

interface GameStats {
  totalGamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPlaytime: number;
  highestStreak: number;
  achievements: number;
  rank: string;
  level: number;
  xp: number;
  nextLevelXp: number;
}

export default function GameStatsPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<GameStats>({
    totalGamesPlayed: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalPlaytime: 0,
    highestStreak: 0,
    achievements: 0,
    rank: "Unranked",
    level: 1,
    xp: 0,
    nextLevelXp: 100,
  });

  useEffect(() => {
    if (user) {
      const metadata = user.unsafeMetadata as any;
      if (metadata?.gameStats) {
        setStats(metadata.gameStats);
      }
    }
  }, [user]);

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const xpProgress = (stats.xp / stats.nextLevelXp) * 100;

  const statCards = [
    {
      icon: Target,
      label: "Games Played",
      value: stats.totalGamesPlayed,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Trophy,
      label: "Wins",
      value: stats.wins,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      icon: TrendingUp,
      label: "Win Rate",
      value: `${stats.winRate.toFixed(1)}%`,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      icon: Zap,
      label: "Highest Streak",
      value: stats.highestStreak,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      icon: Clock,
      label: "Total Playtime",
      value: formatPlaytime(stats.totalPlaytime),
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Award,
      label: "Achievements",
      value: stats.achievements,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-neutral-400">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/settings/account"
          className="hover:text-primary transition-colors"
        >
          Settings
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">Game Stats</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-800/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 sm:p-8 shadow-2xl"
      >
        {/* Mock Data Banner */}
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            <strong>⚠️ Mock Design:</strong> This is a preview interface. Live
            data and functionality will be active upon server release.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Game Statistics
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Track your progress and achievements
            </p>
          </div>
        </div>

        {/* Player Level & Rank */}
        <div className="mb-8 p-4 sm:p-6 bg-linear-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Level {stats.level}
              </h2>
              <p className="text-sm text-neutral-300">Rank: {stats.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">
                {stats.xp} / {stats.nextLevelXp} XP
              </p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-neutral-900/50 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-primary to-secondary"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 ${stat.bgColor} border ${stat.borderColor} rounded-lg`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-neutral-400 mb-1">
                      {stat.label}
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Win/Loss Breakdown */}
        <div className="border-t border-neutral-700/50 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Performance Breakdown
          </h3>

          <div className="space-y-4">
            {/* Wins Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Wins</span>
                <span className="text-sm font-semibold text-green-400">
                  {stats.wins} (
                  {stats.totalGamesPlayed > 0
                    ? ((stats.wins / stats.totalGamesPlayed) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full bg-neutral-900/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width:
                      stats.totalGamesPlayed > 0
                        ? `${(stats.wins / stats.totalGamesPlayed) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            {/* Losses Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Losses</span>
                <span className="text-sm font-semibold text-red-400">
                  {stats.losses} (
                  {stats.totalGamesPlayed > 0
                    ? ((stats.losses / stats.totalGamesPlayed) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full bg-neutral-900/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{
                    width:
                      stats.totalGamesPlayed > 0
                        ? `${(stats.losses / stats.totalGamesPlayed) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {stats.totalGamesPlayed === 0 && (
          <div className="text-center py-8 mt-8 border-t border-neutral-700/50">
            <Users className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="text-neutral-400 mb-2">No games played yet</p>
            <p className="text-sm text-neutral-500">
              Start playing to see your statistics here!
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}
