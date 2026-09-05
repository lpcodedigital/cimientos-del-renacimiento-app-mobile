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
import {
  authenticateWithResult,
  confirmBiometricOptIn,
  getBiometricAvailability,
} from "./biometricService";
import type { PersistedSession } from "./tokenStore";
import { setAuthToken } from "@/lib/http/axiosClient";

export type AuthStatus =
  | "bootstrapping"
  | "unauthenticated"
  | "biometric_opt_in"
  | "needs_biometric"
  | "authenticated";

export type BiometricUnlockMode = "auto" | "manual";

interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  user: AuthBasicUserResponseDTO | null;
  expiresAt: string | null;
  canUseBiometricLogin: boolean;
  biometricUnlockMode: BiometricUnlockMode;
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
  const [canUseBiometricLogin, setCanUseBiometricLogin] = useState(false);
  const [biometricUnlockMode, setBiometricUnlockMode] =
    useState<BiometricUnlockMode>("auto");
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
            setBiometricUnlockMode("auto");
            setCanUseBiometricLogin(false);
            setAuthToken(null);
            setStatus("unauthenticated");
          }
          return;
        }

        const biometricEnabled = await getBiometricEnabled();

        let nextStatus: AuthStatus = "authenticated";
        let nextMode: BiometricUnlockMode = "auto";
        if (biometricEnabled) {
          const availability = await getBiometricAvailability();
          if (availability.hasHardware && availability.isEnrolled) {
            nextStatus = "needs_biometric";
          }
        }

        if (active) {
          setToken(session.token);
          setUser(session.user);
          setExpiresAt(session.expiresAt);
          setBiometricUnlockMode(nextMode);
          setCanUseBiometricLogin(
            biometricEnabled && isSessionVigente(session.expiresAt)
          );
          setAuthToken(session.token);
          setStatus(nextStatus);
        }
      } catch {
        if (active) {
          setToken(null);
          setUser(null);
          setExpiresAt(null);
          setBiometricUnlockMode("auto");
          setCanUseBiometricLogin(false);
          setAuthToken(null);
          setStatus("unauthenticated");
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
    const session: PersistedSession = {
      token: response.token,
      expiresAt: response.expiresAt,
      user: response.user,
    };
    await saveSession(session);

    const availability = await getBiometricAvailability();
    const available = availability.hasHardware && availability.isEnrolled;
    const previouslyEnabled = await getBiometricEnabled();

    setToken(session.token);
    setUser(session.user);
    setExpiresAt(session.expiresAt);
    setAuthToken(session.token);

    if (!available) {
      setStatus("authenticated");
      return;
    }
    if (previouslyEnabled) {
      setBiometricUnlockMode("manual");
      setStatus("needs_biometric");
      return;
    }
    setStatus("biometric_opt_in");
  }, []);

  const unlockWithBiometrics = useCallback(async () => {
    const session = await loadSession();
    if (!session || !isSessionVigente(session.expiresAt)) {
      await clearSession();
      setToken(null);
      setUser(null);
      setExpiresAt(null);
      setCanUseBiometricLogin(false);
      setAuthToken(null);
      setStatus("unauthenticated");
      return;
    }

    const result = await authenticateWithResult();
    if (result !== "success") {
      const reason =
        result === "lockout"
          ? "Demasiados intentos fallidos. Usa tu correo y contraseña."
          : result === "not_enrolled" || result === "not_available"
          ? "No hay Face ID / huella configurado en este dispositivo."
          : "Desbloqueo cancelado o no reconocido. Inténtalo de nuevo.";
      throw new Error(reason);
    }

    setToken(session.token);
    setUser(session.user);
    setExpiresAt(session.expiresAt);
    setAuthToken(session.token);
    setStatus("authenticated");
  }, []);

  const declineBiometricOptIn = useCallback(async () => {
    await setBiometricEnabled(false);
    setStatus("authenticated");
  }, []);

  const enableBiometricAfterLogin = useCallback(async () => {
    const confirmed = await confirmBiometricOptIn();
    if (!confirmed) {
      await setBiometricEnabled(false);
      setStatus("authenticated");
      return;
    }
    await setBiometricEnabled(true);
    setBiometricUnlockMode("manual");
    setStatus("needs_biometric");
  }, []);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    setExpiresAt(null);
    setCanUseBiometricLogin(false);
    setBiometricUnlockMode("auto");
    setAuthToken(null);
    setStatus("unauthenticated");
    await Promise.allSettled([clearSession(), setBiometricEnabled(false)]);
  }, []);

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
