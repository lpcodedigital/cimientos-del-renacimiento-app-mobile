import { useAuth as useAuthFromProvider } from "./AuthProvider";
import type { AuthStatus, BiometricUnlockMode } from "./AuthProvider";
import type { AuthBasicUserResponseDTO } from "./dto";

export type { AuthStatus, BiometricUnlockMode };

export interface UseAuthResult {
  status: AuthStatus;
  token: string | null;
  user: AuthBasicUserResponseDTO | null;
  expiresAt: string | null;
  canUseBiometricLogin: boolean;
  biometricUnlockMode: BiometricUnlockMode;
  signIn: (email: string, password: string) => Promise<void>;
  unlockWithBiometrics: () => Promise<void>;
  declineBiometricOptIn: () => Promise<void>;
  enableBiometricAfterLogin: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  return useAuthFromProvider();
}
