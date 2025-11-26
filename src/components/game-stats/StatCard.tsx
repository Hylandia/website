import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  borderColor: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  borderColor,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 ${bgColor} border ${borderColor} rounded-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-neutral-400 mb-1">{label}</p>
          <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${color}`} />
      </div>
    </motion.div>
  );
}
