export type BiometricAvailability = { hasHardware: boolean; isEnrolled: boolean };
export type BiometricMethodKind = "facial" | "fingerprint" | "iris" | "none";
export type BiometricFallbackReason =
  | "success"
  | "user_cancel"
  | "lockout"
  | "not_enrolled"
  | "not_available"
  | "authentication_failed"
  | "fallback";

export interface BiometricGateway {
  getAvailability(): Promise<BiometricAvailability>;
  authenticate(): Promise<BiometricFallbackReason>;
  confirmOptIn(): Promise<boolean>;
  getSupportedMethods(): Promise<BiometricMethodKind[]>;
}
