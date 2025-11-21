"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Swords, Crown, Sparkles, Copy, Check } from "lucide-react";

interface HeroSectionProps {
  onCopyIP: () => void;
  copiedIP: boolean;
}

export function HeroSection({ onCopyIP, copiedIP }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div
      className="w-full h-screen relative overflow-hidden flex items-center"
      id="home"
    >
      {/* Dynamic background with parallax */}
      <motion.div
        className="absolute inset-0 bg-neutral"
        style={{ y: parallaxY }}
      >
        <img
          src="https://i.imgur.com/OvtdZ7q.jpeg"
          alt="Hylandia Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-br from-neutral/70 via-primary/20 to-secondary/30" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col gap-12 justify-center items-center w-full px-6 py-32">
        <div className="flex flex-col gap-8 justify-center items-center">
          {/* Decorative top element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex gap-3 items-center"
          >
            <Swords className="w-8 h-8 text-accent" />
            <div className="text-accent/80 text-sm font-semibold tracking-widest uppercase">
              Coming to Hytale
            </div>
            <Swords className="w-8 h-8 text-accent" />
          </motion.div>

          <div className="flex flex-col gap-6 justify-center items-center">
            <motion.h1
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.25,
                duration: 0.6,
                type: "spring",
                stiffness: 50,
              }}
              className="text-7xl md:text-9xl font-black text-white tracking-tight text-center relative"
            >
              <span className="relative inline-block">
                Hylandia
                <motion.div
                  className="absolute -inset-2 bg-linear-to-r from-primary/20 via-secondary/20 to-tertiary/20 blur-xl -z-10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.75 }}
              className="text-white md:text-xl text-lg text-center max-w-2xl leading-relaxed font-light drop-shadow-lg"
            >
              A minigames server where your progress actually means something.
              <br />
              <span className="text-white font-semibold drop-shadow-lg">
                Launching shortly after Hytale does.
              </span>
            </motion.p>
          </div>

          {/* Decorative divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative w-full max-w-md h-px my-4"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-accent to-transparent" />
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col md:flex-row gap-4 items-center"
          >
            <motion.button
              type="button"
              onClick={onCopyIP}
              whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-4 rounded-full font-bold cursor-pointer transition-all bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary flex items-center gap-2 shadow-lg shadow-primary/30"
            >
              <span className="text-white text-lg">
                {copiedIP ? "Copied!" : "play.hylandia.net"}
              </span>
              {copiedIP ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Copy className="w-5 h-5 text-white" />
              )}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 rounded-full font-bold cursor-pointer hover:bg-white/10 bg-white/5 border-2 border-accent/40 text-white backdrop-blur-sm transition-all"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Learn More
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
