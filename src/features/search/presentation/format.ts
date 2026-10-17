export function toTitleCase(value: string): string {
  return value
    .toLocaleLowerCase("es-MX")
    .replace(/(^|\s)(\p{L})/gu, (match) =>
      match.toLocaleUpperCase("es-MX")
    );
}

export function formatProgreso(progreso: number, estatus: string): string {
  return `${progreso}% ${toTitleCase(estatus)}`;
}

export function formatUbicacion(
  localidad: string | null,
  municipio: string
): string {
  return localidad !== null
    ? `${toTitleCase(localidad)}, ${toTitleCase(municipio)}`
    : toTitleCase(municipio);
}
