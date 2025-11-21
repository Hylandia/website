"use client";

import { useState } from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import type { CreateExternalAccountParams } from "@clerk/types";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AddPasswordModal } from "@/components/auth/AddPasswordModal";
import { DisconnectAccountModal } from "@/components/auth/DisconnectAccountModal";
import {
  Mail,
  Github,
  Chrome,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PROVIDER_ICONS: Record<string, any> = {
  google: Chrome,
  github: Github,
  microsoft: Mail,
};

const PROVIDER_NAMES: Record<string, string> = {
  oauth_google: "Google",
  oauth_github: "GitHub",
  oauth_microsoft: "Microsoft",
};

export default function ConnectionsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState<{
    isOpen: boolean;
    accountId: string;
    providerName: string;
    accountInfo: string;
  }>({
    isOpen: false,
    accountId: "",
    providerName: "",
    accountInfo: "",
  });

  const externalAccounts = user?.externalAccounts || [];
  const isOAuthOnly =
    user && !user.passwordEnabled && externalAccounts.length > 0;

  // Wrap createExternalAccount with reverification
  const createExternalAccountWithReverification = useReverification(
    (params: CreateExternalAccountParams) => user?.createExternalAccount(params)
  );

  // Wrap destroy with reverification for expired accounts
  const destroyExternalAccountWithReverification = useReverification(
    async (accountId: string) => {
      const account = externalAccounts.find((acc) => acc.id === accountId);
      if (account) {
        await account.destroy();
      }
    }
  );

  // Actions for connecting/disconnecting
  const handleConnect = async (provider: string) => {
    if (isOAuthOnly) {
      setShowAddPasswordModal(true);
      return;
    }

    setIsLoading(provider);
    setError("");

    try {
      const result = await createExternalAccountWithReverification({
        strategy: provider as any,
        redirectUrl: `${window.location.origin}/settings/connections`,
      });

      if (!result) {
        setIsLoading(null);
        return;
      }

      if (result?.verification?.externalVerificationRedirectURL) {
        router.push(result.verification.externalVerificationRedirectURL.href);
      }
    } catch (error: any) {
      console.error("Failed to connect:", error);
      setError("Failed to add connection. Please try again.");
      setIsLoading(null);
    }
  };

  const handleVerify = async (accountId: string, provider: string) => {
    setIsLoading(accountId);
    setError("");

    try {
      const account = externalAccounts.find((acc) => acc.id === accountId);
      if (account) {
        await account.destroy();
        await user?.reload();

        const result = await createExternalAccountWithReverification({
          strategy: `oauth_${provider}` as any,
          redirectUrl: `${window.location.origin}/settings/connections`,
        });

        if (!result) {
          setIsLoading(null);
          return;
        }

        if (result?.verification?.externalVerificationRedirectURL) {
          router.push(result.verification.externalVerificationRedirectURL.href);
        }
      }
    } catch (error: any) {
      console.error("Failed to verify:", error);
      setError("Failed to verify account. Please try again.");
      setIsLoading(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    const account = externalAccounts.find((acc) => acc.id === accountId);
    if (!account) return;

    const providerName =
      PROVIDER_NAMES[`oauth_${account.provider}`] || account.provider;
    const accountInfo = account.emailAddress || account.username || "";

    setDisconnectModal({
      isOpen: true,
      accountId,
      providerName,
      accountInfo,
    });
  };

  const confirmDisconnect = async () => {
    const accountId = disconnectModal.accountId;
    const account = externalAccounts.find((acc) => acc.id === accountId);
    if (!account) return;

    const hasPassword = user?.passwordEnabled;
    const accountCount = externalAccounts.length;
    const isLastMethod = !hasPassword && accountCount <= 1;

    if (isOAuthOnly && isLastMethod) {
      setDisconnectModal({
        isOpen: false,
        accountId: "",
        providerName: "",
        accountInfo: "",
      });
      setShowAddPasswordModal(true);
      return;
    }

    if (isLastMethod) {
      setError(
        "Cannot disconnect your last login method. Add a password or another connection first."
      );
      setDisconnectModal({
        isOpen: false,
        accountId: "",
        providerName: "",
        accountInfo: "",
      });
      return;
    }

    setIsLoading(accountId);
    setError("");

    try {
      // Check if account is expired/unverified
      const isExpired =
        account.verification?.status === "expired" ||
        account.verification?.status === "unverified";

      if (isExpired) {
        // Use reverification for expired accounts
        const result = await destroyExternalAccountWithReverification(
          accountId
        );

        // If user cancelled reverification, result will be null
        if (result === null) {
          setIsLoading(null);
          setDisconnectModal({
            isOpen: false,
            accountId: "",
            providerName: "",
            accountInfo: "",
          });
          return;
        }
      } else {
        // For verified accounts, destroy directly
        await account.destroy();
      }

      // Reload user to get updated external accounts
      await user?.reload();
      setDisconnectModal({
        isOpen: false,
        accountId: "",
        providerName: "",
        accountInfo: "",
      });
    } catch (error: any) {
      console.error("Failed to disconnect:", error);

      if (
        error?.errors?.[0]?.code === "not_allowed_to_delete_last" ||
        error?.message?.includes("last")
      ) {
        setError(
          "Cannot disconnect your last login method. Add a password or another connection first."
        );
      } else if (
        error?.errors?.[0]?.code === "reverification_required" ||
        error?.message?.includes("verification")
      ) {
        setError(
          "Please verify your identity to disconnect this account. Try signing out and back in first."
        );
      } else {
        setError("Failed to disconnect account. Please try again.");
      }
    } finally {
      setIsLoading(null);
    }
  };

  const availableProviders = [
    "oauth_google",
    "oauth_github",
    "oauth_microsoft",
  ];
  // Get list of connected provider names (e.g., "github", "google")
  const connectedProviderNames = externalAccounts.map((acc) => acc.provider);

  // Debug: Log the actual data
  console.log("External Accounts:", externalAccounts);
  console.log("Connected Provider Names:", connectedProviderNames);
  console.log("User object:", user);

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
        <span className="text-white">Connected Accounts</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-800/80 backdrop-blur-xl border-2 border-primary/20 p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_20px_25px_-5px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center gap-3 mb-8">
          <Mail className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(190,95,87,0.5)]" />
          <div>
            <h1 className="text-3xl font-bold text-white font-cinzel uppercase tracking-wider">
              Connected Accounts
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Link your social accounts to sign in with one click
            </p>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="space-y-4 mb-8">
          {externalAccounts.length > 0 ? (
            externalAccounts.map((account) => {
              const Icon = PROVIDER_ICONS[account.provider] || Mail;
              const providerName =
                PROVIDER_NAMES[`oauth_${account.provider}`] || account.provider;

              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-neutral-900/50 border-2 border-neutral-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white uppercase tracking-wide">
                          {providerName}
                        </p>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-sm text-neutral-400">
                        {account.emailAddress ||
                          account.username ||
                          account.label ||
                          "Connected"}
                      </p>
                      {process.env.NODE_ENV === "development" && (
                        <p className="text-xs text-blue-400 mt-1">
                          Status: {account.verification?.status}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {account.verification?.status === "unverified" && (
                      <Button
                        onClick={() =>
                          handleVerify(account.id, account.provider)
                        }
                        disabled={isLoading === account.id}
                        variant="outline"
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/50"
                      >
                        {isLoading === account.id ? (
                          <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Verify
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDisconnect(account.id)}
                      disabled={
                        isLoading === account.id ||
                        (externalAccounts.length === 1 &&
                          !user?.passwordEnabled) ||
                        account.verification?.status === "unverified"
                      }
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    >
                      {isLoading === account.id ? (
                        <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Disconnect
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No connected accounts</p>
            </div>
          )}
        </div>

        {externalAccounts.length === 0 && !user?.passwordEnabled && (
          <div className="mb-6 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
            <p className="text-yellow-400 text-sm font-semibold">
              ⚠️ You must have at least one sign-in method. Add a password or
              connect an account.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          >
            <p className="text-red-400 text-sm flex items-center gap-2 font-semibold uppercase tracking-wide">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </motion.div>
        )}

        {/* Available Providers */}
        <div className="border-t-2 border-neutral-700/50 pt-6">
          <h2 className="text-lg font-semibold text-white font-cinzel uppercase tracking-wider mb-4">
            Add Connection
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {availableProviders.map((provider) => {
              const providerKey = provider.replace("oauth_", "");
              const Icon = PROVIDER_ICONS[providerKey] || Mail;
              const providerName = PROVIDER_NAMES[provider];
              const isConnected = connectedProviderNames.some(
                (p) => p === providerKey
              );

              return (
                <button
                  key={provider}
                  onClick={() => !isConnected && handleConnect(provider)}
                  disabled={isConnected || isLoading === provider}
                  className={`p-4 border-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ${
                    isConnected
                      ? "bg-neutral-900/30 border-neutral-700/30 cursor-not-allowed opacity-50"
                      : "bg-neutral-900/50 border-neutral-700/50 hover:border-primary/50 hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-8 h-8 text-primary" />
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      {providerName}
                    </span>
                    {isConnected ? (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Connected
                      </span>
                    ) : isLoading === provider ? (
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs text-neutral-400">
                        Click to connect
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* OAuth Warning Banner */}
      {isOAuthOnly && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-yellow-400 mt-0.5 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          <div>
            <p className="text-yellow-400 font-bold text-sm uppercase tracking-wide">
              Password Required for Connection Changes
            </p>
            <p className="text-yellow-400/80 text-sm mt-1">
              You signed up using a social login. Add a password to manage your
              connected accounts.
            </p>
            <Button
              onClick={() => setShowAddPasswordModal(true)}
              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
            >
              Add Password
            </Button>
          </div>
        </motion.div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 space-y-3">
          <div className="p-3 bg-yellow-500/10 border-2 border-yellow-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-start gap-2">
            <Shield className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-xs text-yellow-400">
              <strong>Development Mode:</strong> Debug information is only
              visible in development environment.
            </p>
          </div>
          <div className="p-4 bg-blue-500/10 border-2 border-blue-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] text-xs text-blue-400 font-mono">
            <div>External Accounts: {externalAccounts.length}</div>
            {externalAccounts.map((acc, i) => (
              <div key={i} className="mt-1">
                [{i}] Provider: {acc.provider}, ID: {acc.id}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;Email: {acc.emailAddress || "N/A"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;Username: {acc.username || "N/A"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;Verified:{" "}
                {acc.verification?.status || "unknown"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;Label: {acc.label || "N/A"}
              </div>
            ))}
            <div className="mt-2">
              Connected Providers: [{connectedProviderNames.join(", ")}]
            </div>
            <div className="mt-2">
              Password Enabled: {user?.passwordEnabled ? "Yes" : "No"}
            </div>
            <button
              onClick={() => user?.reload()}
              className="mt-2 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-white border-2 border-blue-500/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] uppercase tracking-wider font-semibold text-xs"
            >
              Reload User Data
            </button>
          </div>
        </div>
      )}

      {/* Add Password Modal */}
      <AddPasswordModal
        isOpen={showAddPasswordModal}
        onClose={() => setShowAddPasswordModal(false)}
        onSuccess={() => {
          user?.reload();
        }}
      />

      {/* Disconnect Account Modal */}
      <DisconnectAccountModal
        isOpen={disconnectModal.isOpen}
        onClose={() =>
          setDisconnectModal({
            isOpen: false,
            accountId: "",
            providerName: "",
            accountInfo: "",
          })
        }
        onConfirm={confirmDisconnect}
        providerName={disconnectModal.providerName}
        accountInfo={disconnectModal.accountInfo}
        isLastMethod={!user?.passwordEnabled && externalAccounts.length <= 1}
        hasPassword={user?.passwordEnabled || false}
        isLoading={isLoading === disconnectModal.accountId}
      />
    </>
  );
}
