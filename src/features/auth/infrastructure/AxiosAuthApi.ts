import { AxiosError } from "axios";
import { axiosClient } from "@/shared/infrastructure/http/axiosClient";
import type { Session } from "../domain/entities/Session";
import type { AuthApi } from "../domain/ports/AuthApi";
import { authError, type AuthError } from "../domain/errors/AuthError";
import { AuthRequestDTO, AuthResponseDTO } from "./dto";

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

function toSession(data: AuthResponseDTO): Session {
  return {
    token: data.token,
    expiresAt: data.expiresAt,
    user: data.user,
  };
}

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    typeof (error as AuthError).kind === "string"
  );
}

export async function loginRequest(payload: AuthRequestDTO): Promise<AuthResponseDTO> {
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
      throw authError("mfa_required");
    }

    if (!data.user.active) {
      throw authError("account_inactive");
    }

    return data;
  } catch (error) {
    if (isAuthError(error)) {
      throw error;
    }
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 401 || status === 403 || status === 400) {
        throw authError("invalid_credentials");
      }
      throw authError("server_unreachable");
    }
    throw authError("server_unreachable");
  }
}

export function createAxiosAuthApi(): AuthApi {
  return {
    async login(email: string, password: string): Promise<Session> {
      const data = await loginRequest({ email, password });
      return toSession(data);
    },
  };
}
