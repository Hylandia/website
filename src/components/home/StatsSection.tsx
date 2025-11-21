"use client";

import { motion } from "framer-motion";
import { Gamepad2, Users, Trophy, LucideIcon } from "lucide-react";

const stats = [
  {
    icon: Gamepad2,
    label: "Minigames Planned",
    value: "20+",
    color: "primary",
  },
  {
    icon: Users,
    label: "Status",
    value: "In Development",
    color: "secondary",
  },
  {
    icon: Trophy,
    label: "Launch",
    value: "After Hytale Drops",
    color: "accent",
  },
];

export function StatsSection() {
  return (
    <div className="w-full py-20 bg-linear-to-b from-background to-neutral/50 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col items-center gap-4 p-8 bg-neutral/50 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-${stat.color}/50 transition-all group`}
            >
              <stat.icon
                className={`w-12 h-12 text-${stat.color} group-hover:scale-110 transition-transform`}
              />
              <h3 className="text-4xl font-bold text-white text-center">
                {stat.value}
              </h3>
              <p className="text-white/60 uppercase tracking-wider text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
