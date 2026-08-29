export type BiometricAvailability = {
  hasHardware: boolean;
  isEnrolled: boolean;
};

const NOT_AVAILABLE: BiometricAvailability = {
  hasHardware: false,
  isEnrolled: false,
};

export async function getBiometricAvailability(): Promise<BiometricAvailability> {
  return NOT_AVAILABLE;
}

export async function canUseBiometrics(): Promise<boolean> {
  return false;
}
