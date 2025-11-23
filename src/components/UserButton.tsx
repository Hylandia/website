"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Link as LinkIcon,
  Shield,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";

export function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const displayName =
    user.username || user.emailAddresses[0]?.emailAddress || "User";

  const email = user.emailAddresses[0]?.emailAddress;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-neutral-800/50 border-2 border-neutral-700/50 hover:border-primary/50 transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="w-8 h-8 border-2 border-primary/30"
          />
        ) : (
          <div className="w-8 h-8 bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        )}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            {displayName}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-neutral-800 border-2 border-neutral-700/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="p-4 bg-neutral-900/50 border-b-2 border-neutral-700/50">
              <div className="flex items-center gap-3">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={displayName}
                    className="w-12 h-12 border-2 border-primary/30"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate uppercase tracking-wider">
                    {displayName}
                  </p>
                  {email && (
                    <span className="text-xs text-neutral-400">{email}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/settings/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700/50 hover:text-white transition-colors font-semibold uppercase tracking-wide"
              >
                <Shield className="w-4 h-4" />
                Account Settings
              </Link>

              <Link
                href="/settings/connections"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700/50 hover:text-white transition-colors font-semibold uppercase tracking-wide"
              >
                <LinkIcon className="w-4 h-4" />
                Connected Accounts
              </Link>

              <Link
                href="/settings/security"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700/50 hover:text-white transition-colors font-semibold uppercase tracking-wide"
              >
                <User className="w-4 h-4" />
                Security & Sessions
              </Link>

              <Link
                href="/settings/preferences"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700/50 hover:text-white transition-colors font-semibold uppercase tracking-wide"
              >
                <Settings className="w-4 h-4" />
                Preferences
              </Link>

              <Link
                href="/settings/game-stats"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700/50 hover:text-white transition-colors font-semibold uppercase tracking-wide"
              >
                <Gamepad2 className="w-4 h-4" />
                Game Stats
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-neutral-700/50"></div>

            {/* Sign Out */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full font-semibold uppercase tracking-wide"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
