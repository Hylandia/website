import { motion } from "framer-motion";
import { Sword, Target, Crosshair, Axe } from "lucide-react";

interface WeaponStat {
  kills: number;
  damage: number;
  accuracy?: number;
}

interface WeaponStatsProps {
  weaponStats: {
    [key: string]: WeaponStat;
  };
}

const weaponIcons: Record<string, typeof Sword> = {
  sword: Sword,
  bow: Target,
  axe: Axe,
  trident: Crosshair,
};

const weaponColors: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  sword: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  bow: {
    text: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  axe: {
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  trident: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
};

export function WeaponStats({ weaponStats }: WeaponStatsProps) {
  const weapons = Object.entries(weaponStats);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {weapons.map(([name, stats], index) => {
        const Icon = weaponIcons[name] || Sword;
        const colors = weaponColors[name] || weaponColors.sword;

        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 ${colors.bg} border ${colors.border} rounded-lg`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Icon className={`w-6 h-6 ${colors.text}`} />
              <h4 className="font-bold text-white capitalize">{name}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400">Kills</p>
                <p className={`text-xl font-bold ${colors.text}`}>
                  {stats.kills.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Damage</p>
                <p className={`text-xl font-bold ${colors.text}`}>
                  {stats.damage.toLocaleString()}
                </p>
              </div>
              {stats.accuracy !== undefined && (
                <div className="col-span-2">
                  <p className="text-xs text-neutral-400 mb-1">Accuracy</p>
                  <div className="w-full bg-neutral-900/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${colors.text.replace(
                        "text-",
                        "bg-"
                      )}`}
                      style={{ width: `${stats.accuracy * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {(stats.accuracy * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
