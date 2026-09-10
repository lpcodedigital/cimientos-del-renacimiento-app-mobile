export type AuthErrorKind =
  | "invalid_credentials"
  | "server_unreachable"
  | "mfa_required"
  | "account_inactive";

export interface AuthError {
  kind: AuthErrorKind;
  message: string;
}

export const AUTH_ERROR_MESSAGES: Record<AuthErrorKind, string> = {
  invalid_credentials: "Correo o contraseña incorrectos.",
  server_unreachable: "No fue posible contactar al servidor.",
  mfa_required:
    "El acceso con segundo factor no está disponible en el Gabinete Móvil. Usa la plataforma web.",
  account_inactive: "La cuenta no está activa.",
};

export function authError(kind: AuthErrorKind): AuthError {
  return { kind, message: AUTH_ERROR_MESSAGES[kind] };
}
