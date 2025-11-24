import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Mail,
  Shield,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useUser();
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

  const displayName = user.username || user.email || "User";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-neutral-800/50 border-2 border-neutral-700/50 hover:border-primary/50 transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
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
            <div className="p-4 bg-neutral-900/50 border-b-2 border-neutral-700/50">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
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
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                to="/settings/account"
                className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-neutral-700/50 transition-all duration-150"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Account
                </span>
              </Link>
              <Link
                to="/settings/connections"
                className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-neutral-700/50 transition-all duration-150"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Connections
                </span>
              </Link>
              <Link
                to="/settings/security"
                className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-neutral-700/50 transition-all duration-150"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Security
                </span>
              </Link>
              <Link
                to="/settings/preferences"
                className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-neutral-700/50 transition-all duration-150"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Preferences
                </span>
              </Link>
              <Link
                to="/settings/game-stats"
                className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-neutral-700/50 transition-all duration-150"
              >
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Game Stats
                </span>
              </Link>

              <div className="h-px bg-neutral-700/50 my-2" />

              <Link
                to="/logout"
                className="flex items-center gap-3 px-3 py-2 text-primary hover:text-primary/80 hover:bg-neutral-700/50 transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Sign Out
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
