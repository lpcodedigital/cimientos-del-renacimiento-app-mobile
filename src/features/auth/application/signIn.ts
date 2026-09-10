import type { AuthApi } from "../domain/ports/AuthApi";
import type { AuthTokenHolder } from "../domain/ports/AuthTokenHolder";
import type { BiometricGateway } from "../domain/ports/BiometricGateway";
import type { SessionRepository } from "../domain/ports/SessionRepository";
import type { AuthUseCases } from "./types";

export function createSignIn(deps: {
  authApi: AuthApi;
  sessionRepository: SessionRepository;
  biometricGateway: BiometricGateway;
  tokenHolder: AuthTokenHolder;
}): AuthUseCases["signIn"] {
  const { authApi, sessionRepository, biometricGateway, tokenHolder } = deps;

  return async (email: string, password: string) => {
    const session = await authApi.login(email, password);
    await sessionRepository.save(session);

    const availability = await biometricGateway.getAvailability();
    const available = availability.hasHardware && availability.isEnrolled;
    const previouslyEnabled = await sessionRepository.getBiometricEnabled();

    tokenHolder.setToken(session.token);

    if (!available) {
      return {
        status: "authenticated",
        token: session.token,
        user: session.user,
        expiresAt: session.expiresAt,
        canUseBiometricLogin: false,
        biometricUnlockMode: "auto",
      };
    }
    if (previouslyEnabled) {
      return {
        status: "needs_biometric",
        token: session.token,
        user: session.user,
        expiresAt: session.expiresAt,
        canUseBiometricLogin: false,
        biometricUnlockMode: "manual",
      };
    }
    return {
      status: "biometric_opt_in",
      token: session.token,
      user: session.user,
      expiresAt: session.expiresAt,
      canUseBiometricLogin: false,
      biometricUnlockMode: "auto",
    };
  };
}
