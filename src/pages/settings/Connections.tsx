import { motion } from "framer-motion";
import {
  Link as LinkIcon,
  Unlink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
import { useRemoveConnection } from "@/hooks/useRemoveConnection";
import { authAPI } from "@/lib/auth-api";
import type { OAuthProvider } from "@/types/connections";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PROVIDER_INFO = {
  discord: {
    name: "Discord",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
      </svg>
    ),
    color: "from-[#5865F2] to-[#4752C4]",
  },
  github: {
    name: "GitHub",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: "from-[#333] to-[#24292e]",
  },
  microsoft: {
    name: "Microsoft",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
      </svg>
    ),
    color: "from-[#00A4EF] to-[#0078D4]",
  },
} as const;

export default function ConnectionsSettingsPage() {
  const { data: connections, isLoading, error } = useConnections();
  const removeConnection = useRemoveConnection();
  const [removingProvider, setRemovingProvider] =
    useState<OAuthProvider | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAlert, setShowAlert] = useState(true);

  const message = searchParams.get("message");
  const type = searchParams.get("type") as "success" | "error" | null;

  useEffect(() => {
    if (message && type) {
      setShowAlert(true);
    }
  }, [message, type]);

  const handleDismissAlert = () => {
    setShowAlert(false);
    // Remove query params from URL
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("message");
    newParams.delete("type");
    setSearchParams(newParams, { replace: true });
  };

  const handleRemove = async (provider: OAuthProvider) => {
    if (
      !confirm(
        `Are you sure you want to disconnect your ${PROVIDER_INFO[provider].name} account?`
      )
    ) {
      return;
    }

    setRemovingProvider(provider);
    try {
      await removeConnection.mutateAsync(provider);
    } finally {
      setRemovingProvider(null);
    }
  };

  const handleLink = (provider: OAuthProvider) => {
    authAPI.linkProvider(provider, "/settings/connections");
  };

  const connectedProviders = new Set(connections?.map((c) => c.provider) || []);

  const availableProviders: OAuthProvider[] = [
    "discord",
    "github",
    "microsoft",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="border-b-2 border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <LinkIcon className="w-8 h-8 text-primary" />
          Connected Accounts
        </h1>
        <p className="text-white/60 mt-2">Manage your linked social accounts</p>
      </div>

      {message && type && showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`${
            type === "success"
              ? "bg-green-500/10 border-green-500/30"
              : "bg-red-500/10 border-red-500/30"
          } border-2 p-4 flex items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-3">
            {type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <p
              className={`${
                type === "success" ? "text-green-400" : "text-red-400"
              } font-medium`}
            >
              {message}
            </p>
          </div>
          <button
            onClick={handleDismissAlert}
            className={`${
              type === "success"
                ? "text-green-400 hover:text-green-300"
                : "text-red-400 hover:text-red-300"
            } transition-colors`}
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border-2 border-red-500/30 p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400 font-medium">
            Failed to load connections. Please try again.
          </p>
        </motion.div>
      )}

      {isLoading ? (
        <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-white/60">Loading connections...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {availableProviders.map((provider) => {
            const connection = connections?.find(
              (c) => c.provider === provider
            );
            const isConnected = connectedProviders.has(provider);
            const isRemoving = removingProvider === provider;
            const providerInfo = PROVIDER_INFO[provider];

            return (
              <motion.div
                key={provider}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 bg-linear-to-br ${providerInfo.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      {providerInfo.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                        {providerInfo.name}
                      </h3>
                      {isConnected && connection ? (
                        <div className="flex flex-col gap-1 mt-1">
                          <p className="text-sm text-white/60">
                            {connection.username} • {connection.email}
                          </p>
                          <p className="text-xs text-white/40">
                            Connected{" "}
                            {new Date(
                              connection.connectedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-white/40 mt-1">
                          Not connected
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isConnected ? (
                      <>
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-semibold uppercase tracking-wide">
                            Connected
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemove(provider)}
                          disabled={isRemoving}
                          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 px-4 py-2 text-red-400 font-semibold uppercase tracking-wide text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isRemoving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Disconnecting...
                            </>
                          ) : (
                            <>
                              <Unlink className="w-4 h-4" />
                              Disconnect
                            </>
                          )}
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLink(provider)}
                        className={`flex items-center gap-2 bg-linear-to-r ${providerInfo.color} px-6 py-2 text-white font-semibold uppercase tracking-wide text-xs shadow-lg transition-all hover:shadow-xl`}
                      >
                        <LinkIcon className="w-4 h-4" />
                        Connect
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && connections?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl border-2 border-white/20 p-8 text-center"
        >
          <LinkIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">
            No accounts connected yet. Connect your social accounts to get
            started.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
