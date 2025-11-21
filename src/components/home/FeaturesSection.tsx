"use client";

import { motion } from "framer-motion";
import { Gamepad2, Users, Trophy, Zap, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  features: string[];
  imageName: string;
  imageCaption: string;
  order: "normal" | "reverse";
}

const features: Feature[] = [
  {
    icon: Gamepad2,
    color: "primary",
    title: "Minigames That Matter",
    description:
      "Tired of minigames that reset your progress? Yeah, us too. We're building a system where level ups, abilities, and unlocks stick with you across every game mode. No more starting from zero.",
    features: [
      "Level up once, use it everywhere",
      "Unlock abilities and power-ups that don't disappear",
      "New stuff every season",
    ],
    imageName: "minigames-showcase.jpg",
    imageCaption: "Action-packed gameplay",
    order: "normal",
  },
  {
    icon: Users,
    color: "secondary",
    title: "Community First",
    description:
      "We're building this with players, not just for them. Join our Discord to help shape what Hylandia becomes before we even launch.",
    features: [
      "Help design features before launch",
      "Early access perks for founding members",
      "Be part of something from the start",
    ],
    imageName: "community-events.jpg",
    imageCaption: "Players united",
    order: "reverse",
  },
  {
    icon: Trophy,
    color: "accent",
    title: "Built for Competition",
    description:
      "Ranked seasons, tournaments, leaderboards—we're planning the whole competitive scene from day one.",
    features: [
      "Ranked seasons with rewards",
      "Tournaments every week",
      "Matchmaking that doesn't suck",
    ],
    imageName: "leaderboards.jpg",
    imageCaption: "Rise to the top",
    order: "normal",
  },
];

export function FeaturesSection() {
  return (
    <div
      className="flex flex-col gap-20 w-full items-center px-6 md:px-12 py-20 bg-background relative"
      id="features"
    >
      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl text-center -mb-8"
      >
        <p className="text-white/50 text-sm italic">
          * All images below are concept mockups. Hylandia is currently in
          development and has not been released yet.
        </p>
      </motion.div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {features.map((feature, index) => (
        <FeatureCard key={feature.title} feature={feature} index={index} />
      ))}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const xDirection = feature.order === "normal" ? -50 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: xDirection }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative max-w-6xl w-full"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div
          className={`relative ${
            feature.order === "normal" ? "order-2 md:order-1" : ""
          }`}
        >
          <motion.div
            whileHover={{
              rotate: feature.order === "normal" ? 3 : -3,
              scale: 1.05,
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <div
              className={`absolute inset-0 bg-linear-to-br from-${
                feature.color
              }/30 to-${
                index === 1 ? "tertiary" : "secondary"
              }/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all`}
            />
            <div
              className={`relative w-full h-[350px] rounded-2xl border-4 border-dashed border-${feature.color}/40 flex items-center justify-center bg-neutral/80 backdrop-blur-sm overflow-hidden`}
            >
              <div className="text-center z-10">
                <p className="text-white font-bold text-xl">
                  {feature.imageName}
                </p>
                <p className="text-white/60 text-sm mt-2">
                  {feature.imageCaption}
                </p>
              </div>
              {/* Decorative corner elements */}
              <div
                className={`absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-${feature.color}`}
              />
              <div
                className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-${feature.color}`}
              />
              <div
                className={`absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-${feature.color}`}
              />
              <div
                className={`absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-${feature.color}`}
              />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className={feature.order === "normal" ? "order-1 md:order-2" : ""}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <feature.icon className={`w-10 h-10 text-${feature.color}`} />
            <div
              className={`h-px flex-1 bg-linear-to-r from-${feature.color} to-transparent`}
            />
          </motion.div>
          <h2 className="text-5xl font-black mb-6 bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent pb-2 leading-tight">
            {feature.title}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-6">
            {feature.description}
          </p>
          <ul className="space-y-3">
            {feature.features.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-white/60"
              >
                <Zap className={`w-5 h-5 text-${feature.color}`} />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
