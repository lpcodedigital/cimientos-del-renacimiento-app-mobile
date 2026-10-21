export type DetailErrorKind = "network" | "server" | "unexpected";

export type DetailError = {
  kind: DetailErrorKind;
  message: string;
};

export const DETAIL_ERROR_MESSAGES: Record<DetailErrorKind, string> = {
  network: "Sin conexión. Revisa tu red e inténtalo de nuevo.",
  server: "No se pudo cargar el detalle.",
  unexpected: "No se pudo cargar el detalle.",
};

export function detailError(kind: DetailErrorKind): DetailError {
  return { kind, message: DETAIL_ERROR_MESSAGES[kind] };
}

export function isDetailError(error: unknown): error is DetailError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    "message" in error
  );
}
