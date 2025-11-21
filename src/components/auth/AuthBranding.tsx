"use client";

import { motion } from "framer-motion";
import { Swords, Sparkles, Shield } from "lucide-react";
import Link from "next/link";

export function AuthBranding() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden md:flex flex-col gap-8"
    >
      <Link href="/" className="flex items-center gap-3 group">
        <Swords className="w-12 h-12 text-secondary group-hover:rotate-12 transition-transform" />
        <h1 className="text-5xl font-black bg-linear-to-r from-secondary via-primary to-tertiary bg-clip-text text-transparent pb-2 leading-tight">
          Hylandia
        </h1>
      </Link>

      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-white leading-tight">
          Join the Adventure
          <br />
          <span className="text-secondary">Forge Your Legend</span>
        </h2>
        <p className="text-white/70 text-lg leading-relaxed">
          Experience the first progressive minigames server for Hytale. Build
          your skills, compete with friends, and dominate the leaderboards.
        </p>

        <div className="grid gap-4 pt-4">
          <motion.div
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 text-white/80 group"
          >
            <div className="bg-primary/20 p-3 rounded-xl group-hover:bg-primary/30 transition-all">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Progressive Gameplay</h3>
              <p className="text-sm text-white/50">
                Level up and unlock rewards
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 text-white/80 group"
          >
            <div className="bg-secondary/20 p-3 rounded-xl group-hover:bg-secondary/30 transition-all">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold">Competitive Ranking</h3>
              <p className="text-sm text-white/50">
                Climb the global leaderboards
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
