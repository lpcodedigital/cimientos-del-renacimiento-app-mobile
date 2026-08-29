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
  getBiometricAvailability,
} from "./biometricService";
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
  shouldOfferBiometricOptIn: boolean;
  biometricEnrollHint: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  unlockWithBiometrics: () => Promise<void>;
  declineBiometricOptIn: () => Promise<void>;
  enableBiometricAfterLogin: () => Promise<void>;
  dismissBiometricOptIn: () => void;
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
  const [shouldOfferBiometricOptIn, setShouldOfferBiometricOptIn] =
    useState(false);
  const [biometricEnrollHint, setBiometricEnrollHint] = useState<string | null>(
    null
  );
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

        let nextStatus: AuthStatus = "authenticated";
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
          setAuthToken(session.token);
          setStatus(nextStatus);
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

    const availability = await getBiometricAvailability();
    const available = availability.hasHardware && availability.isEnrolled;

    setToken(response.token);
    setUser(response.user);
    setExpiresAt(response.expiresAt);
    setAuthToken(response.token);
    setShouldOfferBiometricOptIn(available);
    setBiometricEnrollHint(
      availability.hasHardware && !availability.isEnrolled
        ? "El dispositivo soporta Face ID / huella pero aún no tiene ninguna registrada. Regístrala en los Ajustes del dispositivo."
        : null
    );
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
    setShouldOfferBiometricOptIn(false);
    setBiometricEnrollHint(null);
    await setBiometricEnabled(false);
  }, []);

  const enableBiometricAfterLogin = useCallback(async () => {
    await setBiometricEnabled(true);
    setShouldOfferBiometricOptIn(false);
    setBiometricEnrollHint(null);
  }, []);

  const dismissBiometricOptIn = useCallback(() => {
    setShouldOfferBiometricOptIn(false);
    setBiometricEnrollHint(null);
  }, []);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    setExpiresAt(null);
    setShouldOfferBiometricOptIn(false);
    setBiometricEnrollHint(null);
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
      shouldOfferBiometricOptIn,
      biometricEnrollHint,
      signIn,
      unlockWithBiometrics,
      declineBiometricOptIn,
      enableBiometricAfterLogin,
      dismissBiometricOptIn,
      signOut,
    }),
    [
      status,
      token,
      user,
      expiresAt,
      shouldOfferBiometricOptIn,
      biometricEnrollHint,
      signIn,
      unlockWithBiometrics,
      declineBiometricOptIn,
      enableBiometricAfterLogin,
      dismissBiometricOptIn,
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
