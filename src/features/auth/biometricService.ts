import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export type BiometricAvailability = {
  hasHardware: boolean;
  isEnrolled: boolean;
};

const NOT_AVAILABLE: BiometricAvailability = {
  hasHardware: false,
  isEnrolled: false,
};

function androidCanAuthenticate(
  level: LocalAuthentication.SecurityLevel
): boolean {
  return (
    level === LocalAuthentication.SecurityLevel.SECRET ||
    level === LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK ||
    level === LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG ||
    level === LocalAuthentication.SecurityLevel.BIOMETRIC
  );
}

export type BiometricMethodKind = "facial" | "fingerprint" | "iris" | "none";

function optInOptions(): LocalAuthentication.LocalAuthenticationOptions {
  if (Platform.OS === "ios") {
    return {
      promptMessage: "Confirmar Face ID para Gabinete Móvil",
      cancelLabel: "Cancelar",
      fallbackLabel: "",
      disableDeviceFallback: true,
    };
  }
  return {
    promptMessage: "Confirmar desbloqueo biométrico",
    cancelLabel: "Cancelar",
    disableDeviceFallback: false,
  };
}

export async function confirmBiometricOptIn(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync(
      optInOptions()
    );
    return result.success;
  } catch {
    return false;
  }
}

export async function getSupportedBiometricMethods(): Promise<BiometricMethodKind[]> {
  const kinds: BiometricMethodKind[] = [];
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      kinds.push("facial");
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      kinds.push("fingerprint");
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      kinds.push("iris");
    }
  } catch {
    return ["none"];
  }
  return kinds.length > 0 ? kinds : ["none"];
}

export async function getBiometricAvailability(): Promise<BiometricAvailability> {
  if (Platform.OS === "android") {
    const level = await LocalAuthentication.getEnrolledLevelAsync();
    const isEnrolled = androidCanAuthenticate(level);
    return { hasHardware: isEnrolled, isEnrolled };
  }

  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return NOT_AVAILABLE;
  }
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return { hasHardware, isEnrolled };
}

export type BiometricFallbackReason =
  | "success"
  | "user_cancel"
  | "lockout"
  | "not_enrolled"
  | "not_available"
  | "authentication_failed"
  | "fallback";

function biometricOptions(): LocalAuthentication.LocalAuthenticationOptions {
  if (Platform.OS === "ios") {
    return {
      promptMessage: "Desbloquear Gabinete Móvil con Face ID",
      cancelLabel: "Cancelar",
      fallbackLabel: "",
      disableDeviceFallback: true,
    };
  }
  return {
    promptMessage: "Desbloquear Gabinete Móvil",
    cancelLabel: "Cancelar",
    disableDeviceFallback: false,
  };
}

export async function authenticateWithResult(): Promise<BiometricFallbackReason> {
  let result: LocalAuthentication.LocalAuthenticationResult;
  try {
    result = await LocalAuthentication.authenticateAsync(biometricOptions());
  } catch {
    return "fallback";
  }
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
      if (result.error === ("missing_usage_description" as string)) {
        return "not_available";
      }
      return "fallback";
  }
}
