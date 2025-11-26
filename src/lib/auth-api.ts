// API Configuration
export const API_BASE_URL =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "development" && "http://localhost:3001/v1") ||
  "https://api-dev.hylandia.net/v1";

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/user/register`,
    login: `${API_BASE_URL}/auth/user/login`,
    logout: `${API_BASE_URL}/auth/user/logout`,
    me: `${API_BASE_URL}/auth/user/me`,
    resendVerification: `${API_BASE_URL}/auth/user/resend-verification`,
    sessions: `${API_BASE_URL}/auth/user/sessions`,
    revokeSession: (id: string) => `${API_BASE_URL}/auth/user/sessions/${id}`,
  },
} as const;

// API Response Types
export interface APIResponse<T = any> {
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
};
