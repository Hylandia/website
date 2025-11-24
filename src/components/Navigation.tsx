"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sword, Castle, Menu, X } from "lucide-react";
import { UserButton } from "./UserButton";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export function Navigation() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral/5 backdrop-blur-md border-b-2 border-accent/40 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <img
              src="/media/banner.png"
              alt="Hylandia"
              className="h-8 w-auto"
            />
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
                  <>
                    <a
                      href="/settings/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/90 hover:text-secondary transition-colors uppercase tracking-wider text-sm font-semibold py-2"
                    >
                      Account Settings
                    </a>
                    <a
                      href="/settings/connections"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/90 hover:text-secondary transition-colors uppercase tracking-wider text-sm font-semibold py-2"
                    >
                      Connected Accounts
                    </a>
                    <a
                      href="/settings/security"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/90 hover:text-secondary transition-colors uppercase tracking-wider text-sm font-semibold py-2"
                    >
                      Security & Sessions
                    </a>
                    <a
                      href="/settings/preferences"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/90 hover:text-secondary transition-colors uppercase tracking-wider text-sm font-semibold py-2"
                    >
                      Preferences
                    </a>
                    <a
                      href="/settings/game-stats"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/90 hover:text-secondary transition-colors uppercase tracking-wider text-sm font-semibold py-2"
                    >
                      Game Stats
                    </a>
                    <a
                      href="/logout"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/90 hover:text-primary transition-colors uppercase tracking-wider text-sm font-semibold py-2 border-t-2 border-accent/40 mt-2 pt-4"
                    >
                      Sign Out
                    </a>
                  </>
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
