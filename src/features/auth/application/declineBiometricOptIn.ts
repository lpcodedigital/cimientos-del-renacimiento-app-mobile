import type { SessionRepository } from "../domain/ports/SessionRepository";
import type { AuthUseCases } from "./types";

export function createDeclineBiometricOptIn(deps: {
  sessionRepository: SessionRepository;
}): AuthUseCases["declineBiometricOptIn"] {
  const { sessionRepository } = deps;

  return async () => {
    const session = await sessionRepository.load();
    await sessionRepository.setBiometricEnabled(false);

    return {
      status: "authenticated",
      token: session?.token ?? null,
      user: session?.user ?? null,
      expiresAt: session?.expiresAt ?? null,
      canUseBiometricLogin: false,
      biometricUnlockMode: "auto",
    };
  };
}
