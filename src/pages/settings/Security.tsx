import { motion } from "framer-motion";
import {
  Shield,
  Smartphone,
  MapPin,
  Calendar,
  Monitor,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { useSessions } from "@/hooks/useSessions";
import { useRevokeSession } from "@/hooks/useRevokeSession";
import { useRequireAuth } from "@/hooks/useIsAuthenticated";
import type { Session } from "@/lib/auth-api";

function SessionCard({ session }: { session: Session }) {
  const revokeSession = useRevokeSession();

  const handleRevoke = () => {
    if (
      session.isCurrent ||
      confirm("Are you sure you want to revoke this session?")
    ) {
      if (session.isCurrent) {
        alert("You cannot revoke your current session. Please use logout.");
        return;
      }
      revokeSession.mutate(session.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-xl border-2 ${
        session.isCurrent ? "border-primary/50" : "border-white/20"
      } p-6 hover:border-primary/30 transition-all`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Device Info */}
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                {session.deviceName || "Unknown Device"}
              </h3>
              <p className="text-white/60 text-xs">
                {session.browser || "Unknown Browser"} on{" "}
                {session.os || "Unknown OS"}
              </p>
            </div>
            {session.isCurrent && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 border border-primary/30 ml-auto">
                <CheckCircle className="w-3 h-3 text-primary" />
                <span className="text-primary text-xs font-bold uppercase">
                  Current
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          {session.location && (
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                {session.location.city}, {session.location.region},{" "}
                {session.location.country}
              </span>
            </div>
          )}

          {/* IP Address */}
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="font-mono">{session.ipAddress}</span>
          </div>

          {/* Last Active */}
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              Last active: {new Date(session.lastActiveAt).toLocaleString()}
            </span>
          </div>

          {/* Expires */}
          {session.expiresAt && (
            <div className="text-white/40 text-xs">
              Expires: {new Date(session.expiresAt).toLocaleString()}
            </div>
          )}
        </div>

        {/* Revoke Button */}
        {!session.isCurrent && (
          <button
            onClick={handleRevoke}
            disabled={revokeSession.isPending}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border-2 border-red-500/50 text-red-400 font-bold uppercase tracking-wider text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {revokeSession.isPending ? "Revoking..." : "Revoke"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function SecuritySettingsPage() {
  useRequireAuth();
  const { data: sessions, isLoading, error } = useSessions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="border-b-2 border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Security & Sessions
        </h1>
        <p className="text-white/60 mt-2">
          Manage your active sessions and security settings
        </p>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          Active Sessions
        </h2>

        {isLoading ? (
          <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-12 text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-white/60">Loading sessions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-600/10 backdrop-blur-xl border-2 border-red-500/30 p-6">
            <p className="text-red-400 font-bold">Failed to load sessions</p>
            <p className="text-red-400/60 text-sm mt-1">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-12 text-center">
            <Shield className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No active sessions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* Security Recommendations */}
      <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">
          Security Tips
        </h3>
        <ul className="space-y-2 text-white/60 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              Review your active sessions regularly and revoke any unfamiliar
              devices
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Sessions expire after 24 hours of inactivity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Use strong, unique passwords for your account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>
              If you notice suspicious activity, revoke all sessions and change
              your password
            </span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
