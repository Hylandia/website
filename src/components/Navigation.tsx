"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Swords } from "lucide-react";
import { UserButton } from "./UserButton";
import { useAuth } from "@clerk/nextjs";

export function Navigation() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 w-full z-50 bg-neutral backdrop-blur-md border-b border-accent/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/")}
          >
            <Swords className="w-6 h-6 text-primary" />
            <span className="bg-linear-to-r from-secondary via-primary to-tertiary bg-clip-text text-transparent">
              Hylandia
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-white/80 hover:text-secondary transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
            </a>
            <a
              href="/#features"
              className="text-white/80 hover:text-secondary transition-colors relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
            </a>
            <a
              href="#community"
              className="text-white/80 hover:text-secondary transition-colors relative group"
            >
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
            </a>

            {isSignedIn ? (
              <UserButton />
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/auth")}
                className="px-6 py-2 bg-linear-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg shadow-primary/20"
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
