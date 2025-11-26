import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SkillCardProps {
  name: string;
  level: number;
  experience: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  delay?: number;
}

export function SkillCard({
  name,
  level,
  experience,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  delay = 0,
}: SkillCardProps) {
  // Calculate progress to next level (simplified)
  const xpForLevel = (lvl: number) => Math.floor(100 * Math.pow(1.5, lvl - 1));
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpInLevel = experience - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const progress = (xpInLevel / xpNeeded) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`p-4 ${bgColor} border ${borderColor} rounded-lg`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${color}`} />
          <div>
            <h4 className="font-bold text-white capitalize">{name}</h4>
            <p className="text-xs text-neutral-400">
              {experience.toLocaleString()} XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xl font-bold ${color}`}>{level}</span>
          <p className="text-xs text-neutral-400">Level</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-900/50 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className="h-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
      <p className="text-xs text-neutral-500 mt-1 text-right">
        {Math.round(progress)}% to next level
      </p>
    </motion.div>
  );
}
