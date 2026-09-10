import { createExpoBiometricGateway } from "./infrastructure/ExpoBiometricGateway";

export type {
  BiometricAvailability,
  BiometricMethodKind,
  BiometricFallbackReason,
} from "./domain/ports/BiometricGateway";

const gateway = createExpoBiometricGateway();

export function getBiometricAvailability() {
  return gateway.getAvailability();
}

export function authenticateWithResult() {
  return gateway.authenticate();
}

export function confirmBiometricOptIn() {
  return gateway.confirmOptIn();
}

export function getSupportedBiometricMethods() {
  return gateway.getSupportedMethods();
}
