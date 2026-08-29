import * as LocalAuthentication from "expo-local-authentication";

export type BiometricAvailability = {
  hasHardware: boolean;
  isEnrolled: boolean;
};

const NOT_AVAILABLE: BiometricAvailability = {
  hasHardware: false,
  isEnrolled: false,
};

export async function getBiometricAvailability(): Promise<BiometricAvailability> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return NOT_AVAILABLE;
  }
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return { hasHardware, isEnrolled };
}

export async function canUseBiometrics(): Promise<boolean> {
  const availability = await getBiometricAvailability();
  return availability.hasHardware && availability.isEnrolled;
}

export interface Prompts {
  unlockMessage: string;
  unlockCancelLabel: string;
  optInMessage: string;
}

const DEFAULT_PROMPTS: Prompts = {
  unlockMessage: "Desbloquear Gabinete Móvil",
  unlockCancelLabel: "Cancelar",
  optInMessage: "Confirmar la activación de Face ID / huella",
};

export async function authenticateToUnlock(
  override?: Partial<Prompts>
): Promise<boolean> {
  const prompts = { ...DEFAULT_PROMPTS, ...override };
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: prompts.unlockMessage,
    cancelLabel: prompts.unlockCancelLabel,
    disableDeviceFallback: false,
    biometricsSecurityLevel: "strong",
  });
  return result.success;
}

export async function confirmBiometricOptIn(): Promise<boolean> {
  const prompts = DEFAULT_PROMPTS;
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: prompts.optInMessage,
    cancelLabel: prompts.unlockCancelLabel,
    disableDeviceFallback: true,
    biometricsSecurityLevel: "strong",
  });
  return result.success;
}

export type BiometricFallbackReason =
  | "success"
  | "user_cancel"
  | "lockout"
  | "not_enrolled"
  | "not_available"
  | "authentication_failed"
  | "fallback";

export async function authenticateWithResult(): Promise<BiometricFallbackReason> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: DEFAULT_PROMPTS.unlockMessage,
    cancelLabel: DEFAULT_PROMPTS.unlockCancelLabel,
    disableDeviceFallback: false,
    biometricsSecurityLevel: "strong",
  });
  if (result.success) {
    return "success";
  }
  switch (result.error) {
    case "not_enrolled":
      return "not_enrolled";
    case "not_available":
      return "not_available";
    case "lockout":
      return "lockout";
    case "authentication_failed":
      return "authentication_failed";
    case "user_cancel":
    case "system_cancel":
    case "user_fallback":
      return "fallback";
    default:
      return "fallback";
  }
}
