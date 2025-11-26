import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Skull,
  Swords,
  Heart,
  Hammer,
  Footprints,
  TrendingUp,
  DollarSign,
  Award,
  Pickaxe,
  Wheat,
  Fish,
  Sword,
  Trees,
  Mountain,
} from "lucide-react";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { useRequireAuth } from "@/hooks/useIsAuthenticated";
import { PlayerHeader } from "@/components/game-stats/PlayerHeader";
import { StatCard } from "@/components/game-stats/StatCard";
import { SkillCard } from "@/components/game-stats/SkillCard";
import { WeaponStats } from "@/components/game-stats/WeaponStats";
import { RankingCard } from "@/components/game-stats/RankingCard";
import { useUser } from "@/hooks/useUser";

export default function GameStatsSettingsPage() {
  useRequireAuth();
  const { data, isLoading, error } = usePlayerStats();
  const { data: user } = useUser();

  const formatNumber = (num: number) => num.toLocaleString();
  const formatDistance = (blocks: number) => {
    const km = (blocks / 1000).toFixed(1);
    return `${km} km`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-white/60">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border-2 border-red-500 p-6 text-center">
        <p className="text-red-500 font-bold uppercase tracking-wider">
          Failed to load stats
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-500/10 border-2 border-yellow-500 p-6 text-center">
        <p className="text-yellow-500 font-bold uppercase tracking-wider">
          No stats available
        </p>
      </div>
    );
  }

  const { player, statistics, rankings } = data;
  const { general, economy, combat, skills, achievements } = statistics;

  // Skill icons mapping
  const skillIcons: Record<string, typeof Pickaxe> = {
    mining: Pickaxe,
    farming: Wheat,
    fishing: Fish,
    combat: Sword,
    woodcutting: Trees,
    excavation: Mountain,
  };

  const skillColors: Record<
    string,
    { text: string; bg: string; border: string }
  > = {
    mining: {
      text: "text-gray-400",
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
    },
    farming: {
      text: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
    },
    fishing: {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
    combat: {
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
    woodcutting: {
      text: "text-amber-600",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
    excavation: {
      text: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
    },
  };

  // General stats cards
  const generalStatsCards = [
    {
      icon: Skull,
      label: "Deaths",
      value: formatNumber(general.deaths),
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      icon: Swords,
      label: "Player Kills",
      value: formatNumber(general.playerKills),
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
    {
      icon: Heart,
      label: "Mob Kills",
      value: formatNumber(general.mobKills),
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Hammer,
      label: "Blocks Placed",
      value: formatNumber(general.blocksPlaced),
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      icon: Hammer,
      label: "Blocks Broken",
      value: formatNumber(general.blocksBroken),
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      icon: Footprints,
      label: "Distance Walked",
      value: formatDistance(general.distanceWalked),
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
    },
  ];

  // Combat stats cards
  const combatStatsCards = [
    {
      icon: TrendingUp,
      label: "K/D Ratio",
      value: combat.killDeathRatio.toFixed(2),
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      icon: Trophy,
      label: "Longest Streak",
      value: formatNumber(combat.longestKillStreak),
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      icon: Swords,
      label: "Current Streak",
      value: formatNumber(combat.currentKillStreak),
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
  ];

  // Economy stats cards
  const economyStatsCards = [
    {
      icon: DollarSign,
      label: "Current Balance",
      value: `$${formatNumber(Math.floor(economy.balance))}`,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      icon: TrendingUp,
      label: "Total Earned",
      value: `$${formatNumber(Math.floor(economy.totalEarned))}`,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `$${formatNumber(Math.floor(economy.totalSpent))}`,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-neutral-400 uppercase tracking-wider">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/settings/account"
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
        className="bg-neutral-800/80 backdrop-blur-xl border-2 border-primary/20 p-4 sm:p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_20px_25px_-5px_rgba(0,0,0,0.7)]"
      >
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-primary drop-shadow-[0_0_10px_rgba(190,95,87,0.5)]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
              Game Statistics
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Track your progress and achievements
            </p>
          </div>
        </div>

        {/* Player Header with Level & XP */}
        <PlayerHeader
          username={user?.username || player.username}
          displayName={user?.username || player.username || player.displayName}
          level={player.level}
          experience={player.experience}
          firstJoined={player.firstJoined}
          lastSeen={player.lastSeen}
          totalPlaytime={player.totalPlaytime}
        />

        {/* Rankings */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white font-cinzel uppercase tracking-wider mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Global Rankings
          </h3>
          <RankingCard rankings={rankings} />
        </div>

        {/* General Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">
            General Statistics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generalStatsCards.map((stat, index) => (
              <StatCard key={stat.label} {...stat} delay={index * 0.05} />
            ))}
          </div>
        </div>

        {/* Combat Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            Combat Statistics
          </h3>

          {/* Combat Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {combatStatsCards.map((stat, index) => (
              <StatCard key={stat.label} {...stat} delay={index * 0.05} />
            ))}
          </div>

          {/* Weapon Stats */}
          <h4 className="text-md font-semibold text-white mb-3">
            Weapon Statistics
          </h4>
          <WeaponStats weaponStats={combat.weaponStats} />
        </div>

        {/* Economy Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Economy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {economyStatsCards.map((stat, index) => (
              <StatCard key={stat.label} {...stat} delay={index * 0.05} />
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Skills
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(skills).map(([name, data], index) => {
              const skillData = data as { level: number; experience: number };
              const colors = skillColors[name];
              return (
                <SkillCard
                  key={name}
                  name={name}
                  level={skillData.level}
                  experience={skillData.experience}
                  icon={skillIcons[name] || Pickaxe}
                  color={colors.text}
                  bgColor={colors.bg}
                  borderColor={colors.border}
                  delay={index * 0.08}
                />
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="border-t-2 border-neutral-700/50 pt-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Achievements
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-2xl font-bold text-green-400">
                {formatNumber(achievements.completed)}
              </p>
              <p className="text-sm text-neutral-400">Completed</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">
                {formatNumber(achievements.inProgress)}
              </p>
              <p className="text-sm text-neutral-400">In Progress</p>
            </div>
            <div className="text-center p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg">
              <p className="text-2xl font-bold text-gray-400">
                {formatNumber(achievements.locked)}
              </p>
              <p className="text-sm text-neutral-400">Locked</p>
            </div>
            <div className="text-center p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {formatNumber(achievements.total)}
              </p>
              <p className="text-sm text-neutral-400">Total</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-400">
                Achievement Progress
              </span>
              <span className="text-sm text-neutral-400">
                {((achievements.completed / achievements.total) * 100).toFixed(
                  1
                )}
                %
              </span>
            </div>
            <div className="w-full bg-neutral-900/50 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (achievements.completed / achievements.total) * 100
                  }%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-amber-500 to-yellow-500"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
