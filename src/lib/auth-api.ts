import type { PlayerStats } from "@/types/player-stats";
import type { LeaderboardsData } from "@/types/leaderboards";
import type { OAuthConnection, OAuthProvider } from "@/types/connections";

// API Configuration
export const API_BASE_URL =
  import.meta.env.API_BASE_URL ||
  (import.meta.env.VITE_USER_NODE_ENV === "development" && "https://api-dev.hylandia.net/v1") ||
  "https://api.hylandia.net/v1";

export const getAppBaseUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return "";
};

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/user/register`,
    login: `${API_BASE_URL}/auth/user/login`,
    logout: `${API_BASE_URL}/auth/user/logout`,
    me: `${API_BASE_URL}/auth/user/me`,
    updateAccount: `${API_BASE_URL}/auth/user/account`,
    resendVerification: `${API_BASE_URL}/auth/user/resend-verification`,
    sessions: `${API_BASE_URL}/auth/user/sessions`,
    revokeSession: (id: string) => `${API_BASE_URL}/auth/user/sessions/${id}`,
    sendVerificationCode: `${API_BASE_URL}/auth/user/verify-email/send-code`,
    verifyEmail: `${API_BASE_URL}/auth/user/verify-email/verify`,
    sendPasswordResetCode: `${API_BASE_URL}/auth/user/forgot-password/send-code`,
    resetPassword: `${API_BASE_URL}/auth/user/forgot-password/reset-password`,
    connections: `${API_BASE_URL}/auth/user/connections`,
    removeConnection: (provider: string) =>
      `${API_BASE_URL}/auth/user/connections/${provider}`,
    linkProvider: (provider: string, redirectAfter?: string) => {
      const fullRedirectUrl = redirectAfter
        ? `${getAppBaseUrl()}${redirectAfter}`
        : "";
      return `${API_BASE_URL}/auth/oauth/${provider}?link=true${
        fullRedirectUrl
          ? `&redirect_after=${encodeURIComponent(fullRedirectUrl)}`
          : ""
      }`;
    },
  },
  players: {
    stats: `${API_BASE_URL}/players/me/stats`,
    leaderboards: `${API_BASE_URL}/players/leaderboards`,
  },
} as const;

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  code: number;
  data: T | null;
  messages: string[];
}

// User Types
export interface User {
  id: string;
  auth0Id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  provider: string;
  roles: string[];
  roleIds: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Session Types
export interface Session {
  id: string;
  userId?: string;
  auth0Id?: string;
  deviceType?: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  ipAddress: string;
  userAgent?: string;
  location?: {
    country: string;
    region: string;
    city: string;
    lat: number;
    lon: number;
  };
  isActive?: boolean;
  isCurrent?: boolean;
  lastActiveAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// Auth Request Types
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  user: User;
}

// Fetch wrapper with credentials
async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Important: Include cookies
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.messages[0] || "An error occurred");
  }

  return data;
}

// Auth API Service
export const authAPI = {
  register: async (data: RegisterRequest) => {
    return apiFetch<{ user: User; message: string }>(
      API_ENDPOINTS.auth.register,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  login: async (data: LoginRequest) => {
    return apiFetch<LoginResponse>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return apiFetch<{ message: string }>(API_ENDPOINTS.auth.logout, {
      method: "POST",
    });
  },

  getCurrentUser: async () => {
    return apiFetch<User>(API_ENDPOINTS.auth.me);
  },

  updateAccount: async (data: {
    firstName?: string;
    lastName?: string;
    username?: string;
  }) => {
    return apiFetch<User>(API_ENDPOINTS.auth.updateAccount, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  resendVerification: async (email: string) => {
    return apiFetch<{ message: string; note: string }>(
      API_ENDPOINTS.auth.resendVerification,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  },

  getSessions: async () => {
    return apiFetch<Session[]>(API_ENDPOINTS.auth.sessions);
  },

  revokeSession: async (id: string) => {
    return apiFetch<{ message: string }>(API_ENDPOINTS.auth.revokeSession(id), {
      method: "DELETE",
    });
  },

  getPlayerStats: async () => {
    return apiFetch<PlayerStats>(API_ENDPOINTS.players.stats, {
      method: "GET",
    });
  },

  getLeaderboards: async () => {
    return apiFetch<LeaderboardsData>(API_ENDPOINTS.players.leaderboards, {
      method: "GET",
    });
  },

  sendVerificationCode: async (email: string) => {
    return apiFetch<{ message: string }>(
      API_ENDPOINTS.auth.sendVerificationCode,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  },

  verifyEmail: async (data: { email: string; code: string }) => {
    return apiFetch<{ message: string }>(API_ENDPOINTS.auth.verifyEmail, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  sendPasswordResetCode: async (email: string) => {
    return apiFetch<{ message: string }>(
      API_ENDPOINTS.auth.sendPasswordResetCode,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  },

  resetPassword: async (data: {
    email: string;
    code: string;
    newPassword: string;
  }) => {
    return apiFetch<{ message: string }>(API_ENDPOINTS.auth.resetPassword, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getConnections: async () => {
    return apiFetch<OAuthConnection[]>(API_ENDPOINTS.auth.connections);
  },

  removeConnection: async (provider: OAuthProvider) => {
    return apiFetch<{ message: string }>(
      API_ENDPOINTS.auth.removeConnection(provider),
      {
        method: "DELETE",
      }
    );
  },

  linkProvider: (provider: OAuthProvider, redirectAfter?: string) => {
    window.location.href = API_ENDPOINTS.auth.linkProvider(
      provider,
      redirectAfter
    );
  },
};
