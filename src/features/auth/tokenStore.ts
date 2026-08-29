import * as SecureStore from "expo-secure-store";
import { AuthBasicUserResponseDTO } from "./dto";

const JWT_KEY = "jwt";
const EXPIRES_AT_KEY = "expires_at";
const USER_SNAPSHOT_KEY = "user_snapshot";
const BIOMETRIC_ENABLED_KEY = "biometric_enabled";

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export interface PersistedSession {
  token: string;
  expiresAt: string;
  user: AuthBasicUserResponseDTO;
}

export async function saveSession(session: PersistedSession): Promise<void> {
  await SecureStore.setItemAsync(JWT_KEY, session.token, SECURE_STORE_OPTIONS);
  await SecureStore.setItemAsync(EXPIRES_AT_KEY, session.expiresAt, SECURE_STORE_OPTIONS);
  await SecureStore.setItemAsync(
    USER_SNAPSHOT_KEY,
    JSON.stringify(session.user),
    SECURE_STORE_OPTIONS
  );
}

export async function loadSession(): Promise<PersistedSession | null> {
  const [token, expiresAt, userSnapshot] = await Promise.all([
    SecureStore.getItemAsync(JWT_KEY, SECURE_STORE_OPTIONS),
    SecureStore.getItemAsync(EXPIRES_AT_KEY, SECURE_STORE_OPTIONS),
    SecureStore.getItemAsync(USER_SNAPSHOT_KEY, SECURE_STORE_OPTIONS),
  ]);

  if (!token || !expiresAt || !userSnapshot) {
    return null;
  }

  try {
    const user = JSON.parse(userSnapshot) as AuthBasicUserResponseDTO;
    return { token, expiresAt, user };
  } catch {
    await clearSession();
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(JWT_KEY, SECURE_STORE_OPTIONS);
  await SecureStore.deleteItemAsync(EXPIRES_AT_KEY, SECURE_STORE_OPTIONS);
  await SecureStore.deleteItemAsync(USER_SNAPSHOT_KEY, SECURE_STORE_OPTIONS);
}

export async function setBiometricEnabled(value: boolean): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, value ? "true" : "false", SECURE_STORE_OPTIONS);
}

export async function getBiometricEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY, SECURE_STORE_OPTIONS);
  return value === "true";
}
