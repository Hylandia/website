export interface OAuthConnection {
  provider: "discord" | "github" | "microsoft";
  email: string;
  username: string;
  connectedAt: string;
}

export type OAuthProvider = "discord" | "github" | "microsoft";
