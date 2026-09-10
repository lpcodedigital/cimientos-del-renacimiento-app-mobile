import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import type { AuthUseCases, SessionSnapshot } from "./application/types";
import type { BiometricMethodKind } from "./domain/ports/BiometricGateway";
import type { User } from "./domain/entities/User";
import type { AuthStatus, BiometricUnlockMode } from "./domain/sessionLifecycle";

export type { AuthStatus, BiometricUnlockMode };

interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  canUseBiometricLogin: boolean;
  biometricUnlockMode: BiometricUnlockMode;
  signIn: (email: string, password: string) => Promise<void>;
  unlockWithBiometrics: () => Promise<void>;
  declineBiometricOptIn: () => Promise<void>;
  enableBiometricAfterLogin: () => Promise<void>;
  signOut: () => Promise<void>;
  listBiometricMethods: () => Promise<BiometricMethodKind[]>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  useCases,
}: PropsWithChildren<{ useCases: AuthUseCases }>) {
  const [status, setStatus] = useState<AuthStatus>("bootstrapping");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [canUseBiometricLogin, setCanUseBiometricLogin] = useState(false);
  const [biometricUnlockMode, setBiometricUnlockMode] =
    useState<BiometricUnlockMode>("auto");
  const bootstrapped = useRef(false);

  const applySnapshot = useCallback((snapshot: SessionSnapshot) => {
    setStatus(snapshot.status);
    setToken(snapshot.token);
    setUser(snapshot.user);
    setExpiresAt(snapshot.expiresAt);
    setCanUseBiometricLogin(snapshot.canUseBiometricLogin);
    setBiometricUnlockMode(snapshot.biometricUnlockMode);
  }, []);

  useEffect(() => {
    if (bootstrapped.current) {
      return;
    }
    bootstrapped.current = true;

    let active = true;

    async function bootstrap() {
      const snapshot = await useCases.bootstrapSession();
      if (active) {
        applySnapshot(snapshot);
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, [useCases, applySnapshot]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const snapshot = await useCases.signIn(email, password);
      applySnapshot(snapshot);
    },
    [useCases, applySnapshot]
  );

  const unlockWithBiometrics = useCallback(async () => {
    const snapshot = await useCases.unlockWithBiometrics();
    applySnapshot(snapshot);
  }, [useCases, applySnapshot]);

  const declineBiometricOptIn = useCallback(async () => {
    const snapshot = await useCases.declineBiometricOptIn();
    applySnapshot(snapshot);
  }, [useCases, applySnapshot]);

  const enableBiometricAfterLogin = useCallback(async () => {
    const snapshot = await useCases.enableBiometric();
    applySnapshot(snapshot);
  }, [useCases, applySnapshot]);

  const signOut = useCallback(async () => {
    const snapshot = await useCases.signOut();
    applySnapshot(snapshot);
  }, [useCases, applySnapshot]);

  const listBiometricMethods = useCallback(
    () => useCases.listBiometricMethods(),
    [useCases]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      token,
      user,
      expiresAt,
      canUseBiometricLogin,
      biometricUnlockMode,
      signIn,
      unlockWithBiometrics,
      declineBiometricOptIn,
      enableBiometricAfterLogin,
      signOut,
      listBiometricMethods,
    }),
    [
      status,
      token,
      user,
      expiresAt,
      canUseBiometricLogin,
      biometricUnlockMode,
      signIn,
      unlockWithBiometrics,
      declineBiometricOptIn,
      enableBiometricAfterLogin,
      signOut,
      listBiometricMethods,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider.");
  }
  return context;
}
