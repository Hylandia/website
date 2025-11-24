"use client";

import { motion } from "framer-motion";
import { Swords, Users, Trophy } from "lucide-react";

const stats = [
  {
    icon: Swords,
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
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              style={{ willChange: "transform, opacity" }}
              className={`flex flex-col items-center gap-4 p-8 bg-neutral/50 border-2 border-${stat.color}/40 backdrop-blur-sm hover:border-${stat.color}/70 transition-all group shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden`}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/60" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/60" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/60" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/60" />

              <stat.icon
                className={`w-14 h-14 text-${stat.color} group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(190,95,87,0.5)]`}
              />
              <h3
                className="text-4xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {stat.value}
              </h3>
              <p className="text-white/70 uppercase tracking-[0.2em] text-xs font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
