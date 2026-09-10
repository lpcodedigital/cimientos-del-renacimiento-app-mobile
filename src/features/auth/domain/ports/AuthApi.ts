import type { Session } from "../entities/Session";

export interface AuthApi {
  login(email: string, password: string): Promise<Session>;
}
