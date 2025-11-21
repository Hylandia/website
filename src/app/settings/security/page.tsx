"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Shield,
  Smartphone,
  Monitor,
  Trash2,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SecurityPage() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      const sessionsData = await user?.getSessions();
      setSessions(sessionsData || []);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to sign out this device?")) {
      return;
    }

    setIsLoading(sessionId);
    try {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        await session.revoke();
        await loadSessions();
      }
    } catch (error) {
      console.error("Failed to revoke session:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    if (
      deviceType?.includes("mobile") ||
      deviceType?.includes("iOS") ||
      deviceType?.includes("Android")
    ) {
      return Smartphone;
    }
    return Monitor;
  };

  const formatLastActive = (lastActiveAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(lastActiveAt).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Active now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-neutral-400">
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
        <span className="text-white">Security & Sessions</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-800/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 sm:p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Security & Sessions
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Manage your active sessions and security settings
            </p>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">
            Active Sessions
          </h2>

          {sessions.length > 0 ? (
            sessions.map((session) => {
              const DeviceIcon = getDeviceIcon(
                session.latestActivity?.deviceType || ""
              );
              const isCurrent = session.status === "active";

              return (
                <div
                  key={session.id}
                  className="p-3 sm:p-4 bg-neutral-900/50 border border-neutral-700/50 rounded-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center shrink-0">
                        <DeviceIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-white text-sm sm:text-base">
                            {session.latestActivity?.browserName ||
                              "Unknown Browser"}
                          </p>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 text-xs sm:text-sm text-neutral-400">
                          {session.latestActivity?.deviceType && (
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {session.latestActivity.deviceType}
                              </span>
                            </div>
                          )}
                          {session.latestActivity?.ipAddress && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {session.latestActivity.ipAddress}
                                {session.latestActivity?.city && (
                                  <span>
                                    {" "}
                                    • {session.latestActivity.city},{" "}
                                    {session.latestActivity.country}
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>
                              {formatLastActive(session.lastActiveAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isCurrent && (
                      <Button
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={isLoading === session.id}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 shrink-0 w-full sm:w-auto"
                      >
                        {isLoading === session.id ? (
                          <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 mr-1" />
                            Sign Out
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active sessions</p>
            </div>
          )}
        </div>

        {/* Sign Out All Devices */}
        {sessions.length > 1 && (
          <div className="mt-6 pt-6 border-t border-neutral-700/50">
            <Button
              onClick={async () => {
                if (
                  confirm(
                    "Are you sure you want to sign out all other devices? You will remain signed in on this device."
                  )
                ) {
                  for (const session of sessions) {
                    if (session.status !== "active") {
                      await session.revoke();
                    }
                  }
                  await loadSessions();
                }
              }}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Sign Out All Other Devices
            </Button>
          </div>
        )}
      </motion.div>
    </>
  );
}
