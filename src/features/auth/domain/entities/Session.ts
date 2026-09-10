import type { User } from "./User";

export interface Session {
  token: string;
  expiresAt: string;
  user: User;
}
