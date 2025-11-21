declare module "*.css";

export {};

declare global {
  interface UserPublicMetadata {
    role?: "admin" | "moderator" | "player";
    permissions?: string[];
  }

  interface UserPrivateMetadata {
    lastLogin?: string;
    loginCount?: number;
  }
}
