import { createSecureStoreSessionRepository } from "./infrastructure/SecureStoreSessionRepository";
import type { Session } from "./domain/entities/Session";

const repository = createSecureStoreSessionRepository();

export type PersistedSession = Session;

export function saveSession(session: PersistedSession): Promise<void> {
  return repository.save(session);
}

export function loadSession(): Promise<PersistedSession | null> {
  return repository.load();
}

export function clearSession(): Promise<void> {
  return repository.clear();
}

export function setBiometricEnabled(value: boolean): Promise<void> {
  return repository.setBiometricEnabled(value);
}

export function getBiometricEnabled(): Promise<boolean> {
  return repository.getBiometricEnabled();
}
