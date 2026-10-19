const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export const MONTHS_LONG = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

export function formatDate(iso: string) {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
}

// "23 out a 10 nov 2026", ou "3 a 16 nov 2026" no mesmo mês.
export function formatDateRange(start: string, end: string) {
  const a = parts(start);
  const b = parts(end);
  if (a.y !== b.y) return `${formatDate(start)} a ${formatDate(end)}`;
  if (a.m === b.m) return `${a.d} a ${b.d} ${MONTHS_SHORT[b.m - 1]} ${b.y}`;
  return `${a.d} ${MONTHS_SHORT[a.m - 1]} a ${b.d} ${MONTHS_SHORT[b.m - 1]} ${b.y}`;
}

export function formatUsd(value: number | null | undefined) {
  if (value == null) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  }).format(value);
}

export const REGION_PT: Record<string, string> = { Antarctic: "Antártica", Arctic: "Ártico" };

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "19 Oct 2026", como vem nos JSON da Let's Go Polar, vira "19 out 2026".
export function formatFeedDate(text: string) {
  const m = text.match(/^(\d{1,2}) (\w{3}) (\d{4})$/);
  const month = m ? EN_MONTHS.indexOf(m[2]) : -1;
  return m && month >= 0 ? `${m[1]} ${MONTHS_SHORT[month]} ${m[3]}` : text;
}
