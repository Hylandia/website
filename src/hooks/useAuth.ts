"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  authAPI,
  type RegisterRequest,
  type LoginRequest,
  type User,
  type Session,
} from "@/lib/auth-api";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  sessions: () => [...authKeys.all, "sessions"] as const,
};

// Hook: Get current user
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        const response = await authAPI.getCurrentUser();
        return response.data;
      } catch (error) {
        // User not authenticated
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook: Get active sessions
export function useSessions() {
  return useQuery({
    queryKey: authKeys.sessions(),
    queryFn: async () => {
      const response = await authAPI.getSessions();
      return response.data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Hook: Register
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: () => {
      // Redirect to login or show verification message
      router.push("/auth?registered=true");
    },
  });
}

// Hook: Login
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), response.data?.user);

      // Redirect to home or intended page
      const redirectUrl = new URLSearchParams(window.location.search).get(
        "redirect_url"
      );
      router.push(redirectUrl || "/");
    },
  });
}

// Hook: Logout
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.sessions() });

      // Redirect to home
      router.push("/");
    },
  });
}

// Hook: Resend verification email
export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authAPI.resendVerification(email),
  });
}

// Hook: Revoke session
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authAPI.revokeSession(sessionId),
    onSuccess: () => {
      // Refetch sessions list
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });
}

// Hook: Check if user is authenticated
export function useIsAuthenticated() {
  const { data: user, isLoading } = useUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}

// Hook: Require authentication (redirect if not authenticated)
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  if (!isLoading && !isAuthenticated) {
    const currentUrl = window.location.href;
    router.push(`/auth?redirect_url=${encodeURIComponent(currentUrl)}`);
  }

  return { isAuthenticated, isLoading, user };
}
