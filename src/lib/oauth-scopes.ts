import { AuthContext, Errors } from "./api-utils";

export const OAUTH_SCOPES = {
  USER_READ: "user:read",
  USER_READ_EMAIL: "user:read:email",
  USER_READ_RBAC: "user:read:rbac",
  USER: "user",
  USER_STATS: "user:stats",
  USER_PREFERENCES: "user:preferences",
} as const;

export type OAuthScope = (typeof OAUTH_SCOPES)[keyof typeof OAUTH_SCOPES];

/**
 * Parse a scope string into an array of individual scopes
 */
export function parseScopes(scopeString?: string): string[] {
  if (!scopeString) return [];
  return scopeString.split(" ").filter(Boolean);
}

/**
 * Check if a scope string contains a specific scope
 * Supports hierarchical scopes: having "user:read:email" grants access to "user:read"
 */
export function hasScope(
  scopeString: string | undefined,
  requiredScope: string
): boolean {
  if (!scopeString) return false;
  const scopes = parseScopes(scopeString);

  if (scopes.includes(requiredScope)) {
    return true;
  }

  // Special case: "user" scope grants all user:* permissions
  if (scopes.includes(OAUTH_SCOPES.USER)) {
    return requiredScope.startsWith("user:");
  }

  // Hierarchical check: if any granted scope is a child of the required scope
  // Example: having "user:read:email" should grant access to "user:read"
  const hasChildScope = scopes.some(
    (grantedScope) =>
      grantedScope.startsWith(requiredScope + ":") &&
      grantedScope.length > requiredScope.length
  );

  return hasChildScope;
}

/**
 * Check if a scope string contains any of the required scopes
 */
export function hasAnyScope(
  scopeString: string | undefined,
  requiredScopes: string[]
): boolean {
  return requiredScopes.some((scope) => hasScope(scopeString, scope));
}

/**
 * Check if a scope string contains all of the required scopes
 */
export function hasAllScopes(
  scopeString: string | undefined,
  requiredScopes: string[]
): boolean {
  return requiredScopes.every((scope) => hasScope(scopeString, scope));
}

/**
 * Assert that the auth context has the required scope, throws if OAuth token lacks scope
 * For Clerk auth (non-OAuth), this check is skipped as Clerk users have full access
 */
export function assertScope(
  auth: AuthContext | undefined,
  requiredScope: string
): void {
  if (!auth) {
    throw new Errors.Unauthorized("Authentication required");
  }

  if (auth.type === "clerk") {
    return;
  }

  if (!hasScope(auth.scope, requiredScope)) {
    throw new Errors.Forbidden(
      `Insufficient permissions. Required scope: ${requiredScope}`
    );
  }
}

/**
 * Assert that the auth context has any of the required scopes
 */
export function assertAnyScope(
  auth: AuthContext | undefined,
  requiredScopes: string[]
): void {
  if (!auth) {
    throw new Errors.Unauthorized("Authentication required");
  }

  if (auth.type === "clerk") {
    return;
  }

  if (!hasAnyScope(auth.scope, requiredScopes)) {
    throw new Errors.Forbidden(
      `Insufficient permissions. Required scopes (any): ${requiredScopes.join(
        ", "
      )}`
    );
  }
}

/**
 * Assert that the auth context has all of the required scopes
 */
export function assertAllScopes(
  auth: AuthContext | undefined,
  requiredScopes: string[]
): void {
  if (!auth) {
    throw new Errors.Unauthorized("Authentication required");
  }

  if (auth.type === "clerk") {
    return;
  }

  if (!hasAllScopes(auth.scope, requiredScopes)) {
    throw new Errors.Forbidden(
      `Insufficient permissions. Required scopes (all): ${requiredScopes.join(
        ", "
      )}`
    );
  }
}

/**
 * Filter response data based on OAuth scopes
 * Returns a filtered copy of the data object based on allowed scopes
 */
export function filterByScope<T extends Record<string, any>>(
  auth: AuthContext | undefined,
  data: T,
  scopeConfig: Partial<Record<keyof T, string>>
): Partial<T> {
  if (!auth || auth.type === "clerk") {
    return data;
  }

  const filtered: Partial<T> = {};

  for (const [key, requiredScope] of Object.entries(scopeConfig) as [
    keyof T,
    string
  ][]) {
    if (hasScope(auth.scope, requiredScope)) {
      filtered[key] = data[key];
    }
  }

  return filtered;
}
