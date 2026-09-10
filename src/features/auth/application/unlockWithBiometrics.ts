import { isSessionVigente } from "../domain/sessionLifecycle";
import type { AuthTokenHolder } from "../domain/ports/AuthTokenHolder";
import type { BiometricGateway } from "../domain/ports/BiometricGateway";
import type { SessionRepository } from "../domain/ports/SessionRepository";
import { EMPTY_UNAUTHENTICATED, type AuthUseCases } from "./types";

export function createUnlockWithBiometrics(deps: {
  sessionRepository: SessionRepository;
  biometricGateway: BiometricGateway;
  tokenHolder: AuthTokenHolder;
}): AuthUseCases["unlockWithBiometrics"] {
  const { sessionRepository, biometricGateway, tokenHolder } = deps;

  return async () => {
    const session = await sessionRepository.load();
    if (!session || !isSessionVigente(session.expiresAt)) {
      await sessionRepository.clear();
      tokenHolder.setToken(null);
      return EMPTY_UNAUTHENTICATED;
    }

    const result = await biometricGateway.authenticate();
    if (result !== "success") {
      const reason =
        result === "lockout"
          ? "Demasiados intentos fallidos. Usa tu correo y contraseña."
          : result === "not_enrolled" || result === "not_available"
          ? "No hay Face ID / huella configurado en este dispositivo."
          : "Desbloqueo cancelado o no reconocido. Inténtalo de nuevo.";
      throw new Error(reason);
    }

    tokenHolder.setToken(session.token);
    return {
      status: "authenticated",
      token: session.token,
      user: session.user,
      expiresAt: session.expiresAt,
      canUseBiometricLogin: true,
      biometricUnlockMode: "auto",
    };
  };
}
