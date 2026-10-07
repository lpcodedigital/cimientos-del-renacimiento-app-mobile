const mdpFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 1,
});

export function formatMdp(totalInversion: number): string {
  return `${mdpFormatter.format(totalInversion / 1_000_000)} MDP`;
}

export function toTitleCase(nombre: string): string {
  return nombre
    .toLocaleLowerCase("es-MX")
    .replace(/(^|\s)(\p{L})/gu, (match) =>
      match.toLocaleUpperCase("es-MX")
    );
}
