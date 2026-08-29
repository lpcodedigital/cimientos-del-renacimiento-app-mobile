import { AxiosError } from "axios";
import { axiosClient } from "@/lib/http/axiosClient";
import { AuthRequestDTO, AuthResponseDTO } from "./dto";

export type AuthErrorKind =
  | "invalid_credentials"
  | "server_unreachable"
  | "mfa_required"
  | "account_inactive";

export interface AuthDomainError {
  kind: AuthErrorKind;
  message: string;
}

const ERROR_MESSAGES: Record<AuthErrorKind, string> = {
  invalid_credentials: "Correo o contraseña incorrectos.",
  server_unreachable: "No fue posible contactar al servidor.",
  mfa_required:
    "El acceso con segundo factor no está disponible en el Gabinete Móvil. Usa la plataforma web.",
  account_inactive: "La cuenta no está activa.",
};

function domainError(kind: AuthErrorKind): AuthDomainError {
  return { kind, message: ERROR_MESSAGES[kind] };
}

const DEMO_EMAIL = "demo@cdr.mx";
const DEMO_PASSWORD = "demo1234";

function demoLogin(payload: AuthRequestDTO): AuthResponseDTO | null {
  if (payload.email.trim().toLowerCase() === DEMO_EMAIL && payload.password === DEMO_PASSWORD) {
    return {
      token: `demo-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      user: {
        idUser: 1,
        name: "Juan Pérez",
        email: DEMO_EMAIL,
        active: true,
        role: "ADMIN",
        isFirstLogin: true,
      },
      mfaRequired: false,
    };
  }
  return null;
}

export async function loginRequest(
  payload: AuthRequestDTO
): Promise<AuthResponseDTO> {
  const demo = demoLogin(payload);
  if (demo !== null) {
    return demo;
  }

  try {
    const response = await axiosClient.post<AuthResponseDTO>(
      "/api/auth/login",
      payload
    );

    const data = response.data;

    if (data.mfaRequired) {
      throw domainError("mfa_required");
    }

    if (!data.user.active) {
      throw domainError("account_inactive");
    }

    return data;
  } catch (error) {
    if (isAuthDomainError(error)) {
      throw error;
    }
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 401 || status === 403 || status === 400) {
        throw domainError("invalid_credentials");
      }
      throw domainError("server_unreachable");
    }
    throw domainError("server_unreachable");
  }
}

function isAuthDomainError(error: unknown): error is AuthDomainError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    typeof (error as AuthDomainError).kind === "string"
  );
}
