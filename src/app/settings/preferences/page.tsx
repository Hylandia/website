"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Settings, Bell, Globe, Palette, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function PreferencesPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    gameUpdates: true,
    newsletter: false,
  });
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          preferences: {
            notifications,
            language,
            theme,
          },
        },
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-neutral-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/settings/account"
          className="hover:text-primary transition-colors"
        >
          Settings
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">Preferences</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-800/80 backdrop-blur-xl border-2 border-primary/20 p-4 sm:p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_20px_25px_-5px_rgba(0,0,0,0.7)]"
      >
        {/* Mock Data Banner */}
        <div className="mb-6 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <p className="text-yellow-400 text-sm">
            <strong>⚠️ Mock Design:</strong> This is a preview interface. Live
            data and functionality will be active upon server release.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-primary drop-shadow-[0_0_10px_rgba(190,95,87,0.5)]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-cinzel uppercase tracking-wider">
              Preferences
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Customize your experience
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(190,95,87,0.5)]" />
            <h2 className="text-lg font-semibold text-white font-cinzel uppercase tracking-wider">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-900/50 border-2 border-neutral-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <div>
                <Label className="text-white text-sm font-semibold uppercase tracking-wide">
                  Email Notifications
                </Label>
                <p className="text-xs text-neutral-400 mt-1">
                  Receive important updates via email
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    email: !notifications.email,
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications.email ? "bg-primary" : "bg-neutral-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.email ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900/50 border-2 border-neutral-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <div>
                <Label className="text-white text-sm font-semibold uppercase tracking-wide">
                  Push Notifications
                </Label>
                <p className="text-xs text-neutral-400 mt-1">
                  Get real-time notifications in your browser
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    push: !notifications.push,
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications.push ? "bg-primary" : "bg-neutral-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.push ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900/50 border-2 border-neutral-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <div>
                <Label className="text-white text-sm font-semibold uppercase tracking-wide">
                  Game Updates
                </Label>
                <p className="text-xs text-neutral-400 mt-1">
                  Be notified about new features and events
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    gameUpdates: !notifications.gameUpdates,
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications.gameUpdates ? "bg-primary" : "bg-neutral-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.gameUpdates
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900/50 border-2 border-neutral-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <div>
                <Label className="text-white text-sm font-semibold uppercase tracking-wide">
                  Newsletter
                </Label>
                <p className="text-xs text-neutral-400 mt-1">
                  Receive monthly newsletters and announcements
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    newsletter: !notifications.newsletter,
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications.newsletter ? "bg-primary" : "bg-neutral-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.newsletter ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="mb-8 pb-8 border-b-2 border-neutral-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(190,95,87,0.5)]" />
            <h2 className="text-lg font-semibold text-white font-cinzel uppercase tracking-wider">
              Language
            </h2>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 bg-neutral-900/50 border-2 border-neutral-700/50 text-white focus:outline-none focus:border-primary/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] uppercase tracking-wide font-semibold"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        {/* Theme */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(190,95,87,0.5)]" />
            <h2 className="text-lg font-semibold text-white font-cinzel uppercase tracking-wider">
              Theme
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme("dark")}
              className={`p-4 border-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ${
                theme === "dark"
                  ? "bg-neutral-900/80 border-primary/50"
                  : "bg-neutral-900/50 border-neutral-700/50 hover:border-neutral-600"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Moon className="w-6 h-6 text-primary" />
                <span className="text-white text-sm font-bold uppercase tracking-wider">
                  Dark
                </span>
              </div>
            </button>

            <button
              onClick={() => setTheme("light")}
              className={`p-4 border-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ${
                theme === "light"
                  ? "bg-neutral-900/80 border-primary/50"
                  : "bg-neutral-900/50 border-neutral-700/50 hover:border-neutral-600"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Sun className="w-6 h-6 text-primary" />
                <span className="text-white text-sm font-bold uppercase tracking-wider">
                  Light
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/80 text-white"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Preferences"
            )}
          </Button>
          <Link href="/settings/account">
            <Button
              variant="outline"
              className="border-neutral-700 text-white hover:bg-neutral-700"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
