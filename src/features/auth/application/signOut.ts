import type { AuthTokenHolder } from "../domain/ports/AuthTokenHolder";
import type { SessionRepository } from "../domain/ports/SessionRepository";
import { EMPTY_UNAUTHENTICATED, type AuthUseCases } from "./types";

export function createSignOut(deps: {
  sessionRepository: SessionRepository;
  tokenHolder: AuthTokenHolder;
}): AuthUseCases["signOut"] {
  const { sessionRepository, tokenHolder } = deps;

  return async () => {
    tokenHolder.setToken(null);
    await Promise.allSettled([
      sessionRepository.clear(),
      sessionRepository.setBiometricEnabled(false),
    ]);
    return EMPTY_UNAUTHENTICATED;
  };
}
