const MONEY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word,
    )
    .join(" ");
}

export function formatInversion(investment: string): string {
  const amount = Number.parseFloat(investment);
  if (Number.isNaN(amount)) {
    return investment;
  }
  return MONEY_FORMATTER.format(amount);
}

export function formatFechaCurso(courseDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(courseDate);
  if (match === null) {
    return courseDate;
  }
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  if (month < 1 || month > 12) {
    return courseDate;
  }
  return `${day} de ${MESES[month - 1]} de ${match[1]}`;
}
