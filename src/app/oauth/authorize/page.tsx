"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Swords,
  Shield,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { AuthBackground } from "@/components/auth/AuthBackground";

interface OAuthParams {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  state?: string;
}

export default function OAuthAuthorizePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [params, setParams] = useState<OAuthParams>({});

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const currentUrl = window.location.href;
      router.push(`/auth?redirect_url=${encodeURIComponent(currentUrl)}`);
      return;
    }

    setParams({
      client_id: searchParams.get("client_id") || undefined,
      redirect_uri: searchParams.get("redirect_uri") || undefined,
      response_type: searchParams.get("response_type") || "token",
      scope: searchParams.get("scope") || "user:read",
      state: searchParams.get("state") || undefined,
    });
  }, [isLoaded, isSignedIn, searchParams, router]);

  useEffect(() => {
    if (!params.redirect_uri) return;

    try {
      const url = new URL(params.redirect_uri);
      if (!url.protocol.startsWith("http")) {
        setError("Invalid redirect URL protocol. Must be http or https.");
      }
    } catch (e) {
      setError("Invalid redirect URL format.");
    }
  }, [params.redirect_uri]);

  const handleAuthorize = async () => {
    if (!params.redirect_uri) {
      setError("Missing redirect_uri parameter");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch("/api/v1/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope: params.scope || "user:read",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate token");
      }

      const data = await response.json();
      const token = data.data.token;

      const redirectUrl = new URL(params.redirect_uri);

      if (params.response_type === "token") {
        redirectUrl.hash = `access_token=${token}&token_type=Bearer&expires_in=${encodeURIComponent(
          data.data.expiresIn || "30d"
        )}${params.state ? `&state=${params.state}` : ""}`;
      } else {
        redirectUrl.searchParams.set("access_token", token);
        redirectUrl.searchParams.set("token_type", "Bearer");
        if (params.state) redirectUrl.searchParams.set("state", params.state);
      }

      window.location.href = redirectUrl.toString();
    } catch (err: any) {
      setError(err.message || "Failed to authorize");
      setIsLoading(false);
    }
  };

  const handleDeny = () => {
    if (!params.redirect_uri) {
      router.push("/");
      return;
    }

    const redirectUrl = new URL(params.redirect_uri);

    if (params.response_type === "token") {
      redirectUrl.hash = `error=access_denied&error_description=User denied authorization${
        params.state ? `&state=${params.state}` : ""
      }`;
    } else {
      redirectUrl.searchParams.set("error", "access_denied");
      redirectUrl.searchParams.set(
        "error_description",
        "User denied authorization"
      );
      if (params.state) redirectUrl.searchParams.set("state", params.state);
    }

    window.location.href = redirectUrl.toString();
  };

  const getScopePermissions = (scope: string) => {
    const scopes = scope.split(" ");
    const permissions: string[] = [];

    if (scopes.includes("user")) {
      permissions.push("Full access to your user profile");
      permissions.push("View your email address");
      permissions.push("View your role and permissions");
      permissions.push("View your game statistics");
      permissions.push("View your preferences");
      return permissions;
    }

    if (scopes.includes("user:read")) {
      permissions.push(
        "View your basic profile information (username, display name)"
      );
    }
    if (scopes.includes("user:read:email")) {
      permissions.push("View your email address");
    }
    if (scopes.includes("user:read:rbac")) {
      permissions.push("View your role and permissions");
    }
    if (scopes.includes("user:stats")) {
      permissions.push("View your game statistics (wins, losses, level, XP)");
    }
    if (scopes.includes("user:preferences")) {
      permissions.push("View and modify your preferences");
    }

    return permissions.length > 0
      ? permissions
      : ["Access your account information"];
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="animate-spin">
          <Swords className="w-8 h-8 text-primary" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (error && !params.redirect_uri) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral p-4">
        <AuthBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full"
        >
          <div className="bg-neutral-800/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold text-white">
                Authorization Error
              </h1>
            </div>
            <p className="text-neutral-400 mb-6">{error}</p>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const permissions = getScopePermissions(params.scope || "user:read");

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral p-4">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full"
      >
        <div className="bg-neutral-800/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Swords className="w-10 h-10 text-primary" />
              <Shield className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Authorize Application
            </h1>
            <p className="text-neutral-400">
              {params.client_id || "An application"} is requesting access to
              your Hylandia account
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-neutral-900/50 border border-primary/10 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                {user.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt={user.username || "User"}
                    className="w-12 h-12 rounded-full border-2 border-primary/30"
                  />
                )}
                <div>
                  <p className="text-white font-semibold">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username || user.emailAddresses[0]?.emailAddress}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Permissions */}
          <div className="mb-6">
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              This application will be able to:
            </h2>
            <div className="space-y-2">
              {permissions.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-neutral-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Redirect Info */}
          {params.redirect_uri && (
            <div className="bg-neutral-900/30 border border-primary/10 rounded-lg p-4 mb-6">
              <p className="text-xs text-neutral-500 mb-1">Redirect URL</p>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0" />
                <p className="text-sm text-neutral-300 truncate">
                  {params.redirect_uri}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleDeny}
              disabled={isLoading}
              variant="outline"
              className="flex-1 bg-neutral-900/50 border-neutral-700 hover:bg-neutral-900 text-white"
            >
              Deny
            </Button>
            <Button
              onClick={handleAuthorize}
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authorizing...
                </div>
              ) : (
                "Authorize"
              )}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-neutral-500 text-center mt-6">
            By authorizing, you allow this application to access your account
            using the permissions listed above. You can revoke access at any
            time from your account settings.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
