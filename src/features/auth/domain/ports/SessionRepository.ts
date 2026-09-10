import type { Session } from "../entities/Session";

export interface SessionRepository {
  save(session: Session): Promise<void>;
  load(): Promise<Session | null>;
  clear(): Promise<void>;
  setBiometricEnabled(value: boolean): Promise<void>;
  getBiometricEnabled(): Promise<boolean>;
}
