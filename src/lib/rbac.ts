import { User } from "@clerk/nextjs/server";
import { ROLE_PERMISSIONS } from "./permissions";
import { AuthContext, Errors } from "./api-utils";

type Permission = string | string[];

export function getUserEffectivePermissions(user: User | any): Set<string> {
  const role =
    user?.publicMetadata?.role ||
    (user?.role as keyof typeof ROLE_PERMISSIONS | undefined);
  const extra: string[] = (user?.publicMetadata?.permissions as string[]) || [];
  const rolePerms: string[] = role ? (ROLE_PERMISSIONS as any)[role] || [] : [];
  return new Set<string>([...rolePerms, ...extra]);
}

export const hasPermission = (
  user: User,
  permissions: Permission,
  options?: { requireAll?: boolean }
): boolean => {
  const perms = getUserEffectivePermissions(user);
  const requireAll = options?.requireAll ?? true;

  if (Array.isArray(permissions)) {
    if (permissions.length === 0) return true;
    return requireAll
      ? permissions.every((p) => perms.has(p))
      : permissions.some((p) => perms.has(p));
  }
  return perms.has(permissions);
};

/**
 * Server-side guard: throws if the current user lacks required permission(s).
 * Use inside withNextAPI handlers to keep routes concise.
 */
export function assertPermission(
  user: User | null,
  required: Permission,
  options?: { requireAll?: boolean; message?: string }
): void;
export function assertPermission(
  auth: AuthContext | null | undefined,
  required: Permission,
  options?: { requireAll?: boolean; message?: string }
): void;
export function assertPermission(
  userOrAuth: User | AuthContext | null | undefined,
  required: Permission,
  options?: { requireAll?: boolean; message?: string }
) {
  if (!userOrAuth) {
    throw new Errors.Unauthorized();
  }

  // Check if this is an AuthContext object (has type field)
  if (
    "type" in userOrAuth &&
    (userOrAuth.type === "clerk" || userOrAuth.type === "oauth")
  ) {
    const auth = userOrAuth as AuthContext;
    // Permissions can be either an array or Set
    const userPerms =
      auth.permissions instanceof Set
        ? auth.permissions
        : new Set(auth.permissions || []);
    const requireAll = options?.requireAll ?? true;

    let hasRequiredPerms = false;
    if (Array.isArray(required)) {
      if (required.length === 0) {
        hasRequiredPerms = true;
      } else {
        hasRequiredPerms = requireAll
          ? required.every((p) => userPerms.has(p))
          : required.some((p) => userPerms.has(p));
      }
    } else {
      hasRequiredPerms = userPerms.has(required);
    }

    if (!hasRequiredPerms) {
      throw new Errors.Forbidden(
        options?.message || "Insufficient permissions"
      );
    }
  } else {
    // Handle Clerk User object
    const user = userOrAuth as User;
    if (!hasPermission(user, required, { requireAll: options?.requireAll })) {
      throw new Errors.Forbidden(
        options?.message || "Insufficient permissions"
      );
    }
  }
}
