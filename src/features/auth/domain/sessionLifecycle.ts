export type AuthStatus =
  | "bootstrapping"
  | "unauthenticated"
  | "biometric_opt_in"
  | "needs_biometric"
  | "authenticated";

export type BiometricUnlockMode = "auto" | "manual";

export function isSessionVigente(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() > Date.now();
}
