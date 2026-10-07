export type RadarErrorKind = "radar_unavailable";

export type RadarError = {
  kind: RadarErrorKind;
  message: string;
};

export const RADAR_ERROR_MESSAGES: Record<RadarErrorKind, string> = {
  radar_unavailable: "No se pudo cargar el radar territorial.",
};

export function radarError(kind: RadarErrorKind): RadarError {
  return { kind, message: RADAR_ERROR_MESSAGES[kind] };
}
