"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, Castle, Menu, X } from "lucide-react";
import { UserButton } from "./UserButton";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export function Navigation() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-neutral backdrop-blur-md border-b-2 border-accent/40 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 text-2xl font-black cursor-pointer"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
            onClick={() => router.push("/")}
          >
            <Castle className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(190,95,87,0.5)]" />
            <span className="bg-linear-to-r from-secondary via-primary to-tertiary bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide">
              HYLANDIA
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-white/90 hover:text-secondary transition-colors relative group uppercase tracking-wider text-sm font-semibold"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full shadow-[0_0_8px_rgba(240,153,99,0.6)]" />
            </a>
            <a
              href="/#features"
              className="text-white/90 hover:text-secondary transition-colors relative group uppercase tracking-wider text-sm font-semibold"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full shadow-[0_0_8px_rgba(240,153,99,0.6)]" />
            </a>
            <a
              href="#community"
              className="text-white/90 hover:text-secondary transition-colors relative group uppercase tracking-wider text-sm font-semibold"
            >
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full shadow-[0_0_8px_rgba(240,153,99,0.6)]" />
            </a>

            {isSignedIn ? (
              <UserButton />
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/auth")}
                className="px-6 py-2 bg-linear-to-r from-primary to-secondary text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.3)] border-2 border-primary/30 uppercase tracking-wider text-sm flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Sign In
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t-2 border-accent/40 mt-4"
            >
              <div className="flex flex-col gap-4 py-4">
                <a
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/90 hover:text-secondary transition-colors uppercase tracking-wider text-sm font-semibold py-2"
                >
                  Home
                </a>
                <a
                  href="/#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/90 hover:text-secondary transition-colors uppercase tracking-wider text-sm font-semibold py-2"
                >
                  Features
                </a>
                <a
                  href="#community"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/90 hover:text-secondary transition-colors uppercase tracking-wider text-sm font-semibold py-2"
                >
                  Community
                </a>

                {isSignedIn ? (
                  <div className="py-2">
                    <UserButton />
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push("/auth");
                    }}
                    className="px-6 py-3 bg-linear-to-r from-primary to-secondary text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.3)] border-2 border-primary/30 uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Sign In
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
