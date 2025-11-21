"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="min-h-screen w-screen bg-neutral relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <img
          src="https://i.imgur.com/OvtdZ7q.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-br from-neutral/95 via-primary/10 to-secondary/20" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Swords className="w-16 h-16 text-secondary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Completing Sign In
          </h2>
          <p className="text-white/60">
            Please wait while we authenticate you...
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SSOCallback() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="flex items-center justify-center min-h-screen">
        <AuthenticateWithRedirectCallback
          afterSignInUrl="/"
          afterSignUpUrl="/"
          redirectUrl="/"
        />
      </div>
    </Suspense>
  );
}
