// Define all available permissions
export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: "users:manage",
  MANAGE_SETTINGS: "settings:manage",
} as const;

// Define role-based permissions
export const ROLE_PERMISSIONS: Record<
  Exclude<UserPublicMetadata["role"], undefined>,
  string[]
> = {
  admin: Object.values(PERMISSIONS),
  moderator: [],
  player: [],
};
