"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import { AuthBackground } from "@/components/auth/AuthBackground";

export default function LogoutPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    signOut();
    router.push("/");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral p-4">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-neutral-800/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl text-center">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Swords className="w-16 h-16 text-primary" />
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2 text-white">
            Signing You Out
          </h1>
          <p className="text-sm mb-6 text-neutral-400">
            We're finishing things up — you'll be redirected to the home page
            shortly.
          </p>

          {/* Loading Indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm text-neutral-300">Signing out…</span>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700/50"></div>
            </div>
          </div>

          {/* Fallback Links */}
          <div className="text-xs text-neutral-400">
            If you're not redirected,{" "}
            <Link
              href="/"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              return to the homepage
            </Link>{" "}
            or{" "}
            <button
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="font-medium text-secondary hover:text-secondary/80 transition-colors"
            >
              sign out now
            </button>
            .
          </div>
        </div>
      </motion.div>
    </div>
  );
}
