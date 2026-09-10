import { isSessionVigente } from "../domain/sessionLifecycle";
import type { AuthTokenHolder } from "../domain/ports/AuthTokenHolder";
import type { BiometricGateway } from "../domain/ports/BiometricGateway";
import type { SessionRepository } from "../domain/ports/SessionRepository";
import { EMPTY_UNAUTHENTICATED, type AuthUseCases } from "./types";

export function createBootstrapSession(deps: {
  sessionRepository: SessionRepository;
  biometricGateway: BiometricGateway;
  tokenHolder: AuthTokenHolder;
}): AuthUseCases["bootstrapSession"] {
  const { sessionRepository, biometricGateway, tokenHolder } = deps;

  return async () => {
    try {
      const session = await sessionRepository.load();
      if (!session || !isSessionVigente(session.expiresAt)) {
        if (session) {
          await sessionRepository.clear();
        }
        tokenHolder.setToken(null);
        return EMPTY_UNAUTHENTICATED;
      }

      const biometricEnabled = await sessionRepository.getBiometricEnabled();

      let status: "authenticated" | "needs_biometric" = "authenticated";
      if (biometricEnabled) {
        const availability = await biometricGateway.getAvailability();
        if (availability.hasHardware && availability.isEnrolled) {
          status = "needs_biometric";
        }
      }

      tokenHolder.setToken(session.token);
      return {
        status,
        token: session.token,
        user: session.user,
        expiresAt: session.expiresAt,
        canUseBiometricLogin: biometricEnabled && isSessionVigente(session.expiresAt),
        biometricUnlockMode: "auto",
      };
    } catch {
      tokenHolder.setToken(null);
      return EMPTY_UNAUTHENTICATED;
    }
  };
}
