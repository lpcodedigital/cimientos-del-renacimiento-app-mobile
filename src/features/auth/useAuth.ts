import { useAuth as useAuthFromProvider } from "./AuthProvider";
import type { AuthStatus, BiometricUnlockMode } from "./domain/sessionLifecycle";
import type { BiometricMethodKind } from "./domain/ports/BiometricGateway";
import type { User } from "./domain/entities/User";

export type { AuthStatus, BiometricUnlockMode, BiometricMethodKind };

export interface UseAuthResult {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  canUseBiometricLogin: boolean;
  biometricUnlockMode: BiometricUnlockMode;
  signIn: (email: string, password: string) => Promise<void>;
  unlockWithBiometrics: () => Promise<void>;
  declineBiometricOptIn: () => Promise<void>;
  enableBiometricAfterLogin: () => Promise<void>;
  signOut: () => Promise<void>;
  listBiometricMethods: () => Promise<BiometricMethodKind[]>;
}

export function useAuth(): UseAuthResult {
  return useAuthFromProvider();
}
