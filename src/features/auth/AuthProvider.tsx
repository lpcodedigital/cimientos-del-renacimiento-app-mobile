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
import { AuthBasicUserResponseDTO } from "./dto";
import { loginRequest } from "./api";
import {
  clearSession,
  getBiometricEnabled,
  loadSession,
  saveSession,
  setBiometricEnabled,
} from "./tokenStore";
import { setAuthToken } from "@/lib/http/axiosClient";

export type AuthStatus =
  | "bootstrapping"
  | "unauthenticated"
  | "needs_biometric"
  | "authenticated";

interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  user: AuthBasicUserResponseDTO | null;
  expiresAt: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  unlockWithBiometrics: () => Promise<void>;
  declineBiometricOptIn: () => Promise<void>;
  enableBiometricAfterLogin: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isSessionVigente(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() > Date.now();
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>("bootstrapping");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthBasicUserResponseDTO | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) {
      return;
    }
    bootstrapped.current = true;

    let active = true;

    async function bootstrap() {
      try {
        const session = await loadSession();
        if (!session || !isSessionVigente(session.expiresAt)) {
          if (session) {
            await clearSession();
          }
          if (active) {
            setToken(null);
            setUser(null);
            setExpiresAt(null);
            setStatus("unauthenticated");
            setAuthToken(null);
          }
          return;
        }

        const biometricEnabled = await getBiometricEnabled();

        if (active) {
          setToken(session.token);
          setUser(session.user);
          setExpiresAt(session.expiresAt);
          setAuthToken(session.token);
          setStatus(biometricEnabled ? "needs_biometric" : "authenticated");
        }
      } catch {
        if (active) {
          setToken(null);
          setUser(null);
          setExpiresAt(null);
          setStatus("unauthenticated");
          setAuthToken(null);
        }
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await loginRequest({ email, password });
    await saveSession({
      token: response.token,
      expiresAt: response.expiresAt,
      user: response.user,
    });

    setToken(response.token);
    setUser(response.user);
    setExpiresAt(response.expiresAt);
    setAuthToken(response.token);
    setStatus("authenticated");
  }, []);

  const unlockWithBiometrics = useCallback(async () => {
    const session = await loadSession();
    if (!session || !isSessionVigente(session.expiresAt)) {
      await clearSession();
      setToken(null);
      setUser(null);
      setExpiresAt(null);
      setAuthToken(null);
      setStatus("unauthenticated");
      return;
    }

    setToken(session.token);
    setUser(session.user);
    setExpiresAt(session.expiresAt);
    setAuthToken(session.token);
    setStatus("authenticated");
  }, []);

  const declineBiometricOptIn = useCallback(async () => {
    await setBiometricEnabled(false);
  }, []);

  const enableBiometricAfterLogin = useCallback(async () => {
    await setBiometricEnabled(true);
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    await setBiometricEnabled(false);
    setToken(null);
    setUser(null);
    setExpiresAt(null);
    setAuthToken(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      token,
      user,
      expiresAt,
      signIn,
      unlockWithBiometrics,
      declineBiometricOptIn,
      enableBiometricAfterLogin,
      signOut,
    }),
    [
      status,
      token,
      user,
      expiresAt,
      signIn,
      unlockWithBiometrics,
      declineBiometricOptIn,
      enableBiometricAfterLogin,
      signOut,
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
