import type { BiometricGateway } from "../domain/ports/BiometricGateway";
import type { SessionRepository } from "../domain/ports/SessionRepository";
import type { AuthUseCases } from "./types";

export function createEnableBiometric(deps: {
  sessionRepository: SessionRepository;
  biometricGateway: BiometricGateway;
}): AuthUseCases["enableBiometric"] {
  const { sessionRepository, biometricGateway } = deps;

  return async () => {
    const session = await sessionRepository.load();
    const confirmed = await biometricGateway.confirmOptIn();

    if (!confirmed) {
      await sessionRepository.setBiometricEnabled(false);
      return {
        status: "authenticated",
        token: session?.token ?? null,
        user: session?.user ?? null,
        expiresAt: session?.expiresAt ?? null,
        canUseBiometricLogin: false,
        biometricUnlockMode: "auto",
      };
    }

    await sessionRepository.setBiometricEnabled(true);
    return {
      status: "needs_biometric",
      token: session?.token ?? null,
      user: session?.user ?? null,
      expiresAt: session?.expiresAt ?? null,
      canUseBiometricLogin: false,
      biometricUnlockMode: "manual",
    };
  };
}
