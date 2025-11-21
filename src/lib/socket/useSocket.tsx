"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { SocketClient } from "@/lib/socket";

/**
 * @param {string?} oauthToken - Optional OAuth token. If not provided, will use Clerk session token
 */
export function useSocket(oauthToken?: string) {
  const [socket] = useState(() => new SocketClient());
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    let mounted = true;

    const initSocket = async () => {
      try {
        let token: string | null = null;

        if (oauthToken) {
          token = oauthToken;
        } else if (isSignedIn) {
          token = await getToken();
        }

        if (!token) {
          setError("No authentication token available");
          return;
        }

        if (!mounted) return;

        await socket.connect(token);

        if (!mounted) return;

        socket.on("connect", () => {
          if (mounted) {
            console.log("Connected to WebSocket");
            setConnected(true);
            setError(null);
          }
        });

        socket.on("disconnect", () => {
          if (mounted) {
            console.log("Disconnected from WebSocket");
            setConnected(false);
          }
        });

        socket.on("auth:success", (data) => {
          if (mounted) {
            console.log("Authenticated as:", data.userId);
            setError(null);
          }
        });

        socket.on("auth:failed", (data) => {
          if (mounted) {
            console.error("Auth failed:", data.message);
            setError(data.message || "Authentication failed");
          }
        });

        socket.on("error", (data) => {
          if (mounted) {
            console.error("Server error:", data);
            setError(data.message || "An error occurred");
          }
        });
      } catch (err: any) {
        if (mounted) {
          console.error("Socket connection error:", err);
          setError(err.message || "Failed to connect");
        }
      }
    };

    initSocket();

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, [socket, oauthToken, isSignedIn, getToken]);

  return { socket, connected, error };
}
