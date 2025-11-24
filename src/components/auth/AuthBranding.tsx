import { motion } from "framer-motion";
import { Shield, Sword } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthBranding() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden md:flex flex-col gap-8"
    >
      <Link to="/" className="flex items-center group">
        <img src="/media/banner.png" alt="Hylandia" className="h-16 w-auto" />
      </Link>

      <div className="space-y-6">
        <h2
          className="text-4xl font-black text-white leading-tight uppercase tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Join the Adventure
          <br />
          <span className="text-secondary drop-shadow-[0_0_10px_rgba(240,153,99,0.6)]">
            Forge Your Legend
          </span>
        </h2>
        <p className="text-white/80 text-lg leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          Experience the first progressive minigames server for Hytale. Build
          your skills, compete with friends, and dominate the leaderboards.
        </p>

        <div className="grid gap-4 pt-4">
          <div className="flex items-center gap-4 text-white/80 group">
            <div className="bg-primary/20 p-3 border-2 border-primary/40 group-hover:bg-primary/30 group-hover:border-primary/60 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <Sword className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(190,95,87,0.5)]" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm">
                Progressive Gameplay
              </h3>
              <p className="text-xs text-white/60">
                Level up and unlock rewards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/80 group">
            <div className="bg-secondary/20 p-3 border-2 border-secondary/40 group-hover:bg-secondary/30 group-hover:border-secondary/60 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <Shield className="w-6 h-6 text-secondary drop-shadow-[0_0_8px_rgba(240,153,99,0.5)]" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm">
                Competitive Ranking
              </h3>
              <p className="text-xs text-white/60">
                Climb the global leaderboards
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
