import type { User } from "../domain/entities/User";
import type { BiometricMethodKind } from "../domain/ports/BiometricGateway";
import type {
  AuthStatus,
  BiometricUnlockMode,
} from "../domain/sessionLifecycle";

export interface SessionSnapshot {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  canUseBiometricLogin: boolean;
  biometricUnlockMode: BiometricUnlockMode;
}

export const EMPTY_UNAUTHENTICATED: SessionSnapshot = {
  status: "unauthenticated",
  token: null,
  user: null,
  expiresAt: null,
  canUseBiometricLogin: false,
  biometricUnlockMode: "auto",
};

export interface AuthUseCases {
  bootstrapSession: () => Promise<SessionSnapshot>;
  signIn: (email: string, password: string) => Promise<SessionSnapshot>;
  unlockWithBiometrics: () => Promise<SessionSnapshot>;
  enableBiometric: () => Promise<SessionSnapshot>;
  declineBiometricOptIn: () => Promise<SessionSnapshot>;
  signOut: () => Promise<SessionSnapshot>;
  listBiometricMethods: () => Promise<BiometricMethodKind[]>;
}
