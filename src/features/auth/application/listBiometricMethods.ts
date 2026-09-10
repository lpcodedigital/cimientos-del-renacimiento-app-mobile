import type { BiometricGateway } from "../domain/ports/BiometricGateway";
import type { AuthUseCases } from "./types";

export function createListBiometricMethods(deps: {
  biometricGateway: BiometricGateway;
}): AuthUseCases["listBiometricMethods"] {
  const { biometricGateway } = deps;

  return async () => biometricGateway.getSupportedMethods();
}
