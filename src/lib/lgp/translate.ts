// Memória de tradução do conteúdo das viagens.
//
// Cada texto em inglês vindo da Let's Go Polar é uma "unidade": um nome curto
// (título, cabine, destino) ou o conteúdo de um bloco de HTML (parágrafo, item de
// lista, célula). A tradução fica em content/lgp/strings.pt.json, com o texto em
// inglês normalizado como chave. Se a Let's Go Polar muda um parágrafo, a chave
// muda e só aquele parágrafo volta para a fila (npm run lgp:strings:check).
//
// As mesmas funções extraem as unidades (no script) e aplicam a tradução (nas
// páginas), para que as duas coisas nunca divirjam.

import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import type { BoardTrip, TripDetail } from "./source";

export const STRINGS_FILE = path.join(process.cwd(), "content/lgp/strings.pt.json");

const BLOCK = /<(p|li|h[1-6]|td|th|figcaption|blockquote|summary)\b[^>]*>([\s\S]*?)<\/\1>/gi;

export function normText(text: string) {
  return text.replace(/&nbsp;| /g, " ").replace(/\s+/g, " ").trim();
}

function hasWords(text: string) {
  return /[A-Za-z]{2}/.test(text.replace(/<[^>]+>/g, ""));
}

// Limpa o HTML vindo da Let's Go Polar: tira scripts, estilos inline, spans de
// formatação e atributos de evento. O que sobra é estrutura e texto.
export function cleanHtml(html: string) {
  return html
    .replace(/<(script|style|object|embed|form)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<iframe\b(?![^>]*src="https:\/\/(?:www\.youtube(?:-nocookie)?\.com|player\.vimeo\.com|embed\.windy\.com|open\.spotify\.com)\/)[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<(script|object|embed|input|button)\b[^>]*\/?>/gi, "")
    .replace(/\s(on\w+|style|class|id|data-[\w-]+)="[^"]*"/gi, "")
    .replace(/\s(on\w+|style|class|id)='[^']*'/gi, "")
    .replace(/href="\s*javascript:[^"]*"/gi, 'href="#"')
    .replace(/<\/?(span|font|div)\b[^>]*>/gi, "")
    .replace(/&nbsp;| /g, " ")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
}

export function htmlUnits(html: string | null | undefined): string[] {
  if (!html) return [];
  const clean = cleanHtml(html);
  const units: string[] = [];
  let found = false;
  for (const m of clean.matchAll(BLOCK)) {
    found = true;
    const inner = normText(m[2]);
    if (hasWords(inner)) units.push(inner);
  }
  if (!found && hasWords(clean)) units.push(normText(clean));
  return units;
}

// Atividades vêm como "Sea Kayaking - $1,995" ou "Zodiac Cruising (included)".
// Só o nome é traduzido, o preço fica como está.
function splitActivity(text: string) {
  const m = normText(text).match(/^(.*?)(\s*(?:-|–)\s*\$[\d,.]+.*|\s*\(included\))?$/i);
  return { name: m?.[1] ?? text, rest: m?.[2] ?? "" };
}

// ---------------------------------------------------------------------------
// Extração (usada pelo script de pendências)

export function boardUnits(trip: BoardTrip): string[] {
  return [
    trip.title,
    trip.embark,
    trip.disembark,
    ...trip.dest,
    ...trip.fdest,
    ...trip.specialty,
    ...trip.activityTags,
    ...trip.acts.map((a) => splitActivity(a.text).name),
    trip.fareLabel ?? "",
  ].map(normText).filter(hasWords);
}

export function tripUnits(detail: TripDetail): string[] {
  const t = detail.target;
  const plain = [
    t.meta.title,
    t.meta.embarcation,
    t.meta.disembarcation,
    ...t.itinerary.map((i) => i.title),
    ...t.things_to_do.flatMap((a) => [a.name, a.photo_alt ?? ""]),
    ...t.faqs.map((f) => f.q),
    ...t.cabins.flatMap((c) => [c.name, c.view ?? ""]),
    ...(t.ship ? [t.ship.type ?? "", ...t.ship.facilities] : []),
    ...t.terms.map((x) => x.name),
    ...(detail.feed?.activities ?? []).map((a) => splitActivity(a.text).name),
  ];
  const html = [
    ...t.itinerary.map((i) => i.html),
    ...t.things_to_do.map((a) => a.html),
    ...t.faqs.map((f) => f.a),
    ...t.cabins.map((c) => c.description),
    t.ship?.description,
    t.ship?.practical_info,
    t.operator?.payment_terms,
  ];
  return [...plain.map(normText).filter(hasWords), ...html.flatMap(htmlUnits)];
}

// ---------------------------------------------------------------------------
// Aplicação (usada pelas páginas)

let memory: Record<string, string> = {};
let loadedAt = -1;

// Relê o arquivo só quando ele muda, para que uma tradução nova apareça sem
// reiniciar o servidor.
function loadMemory(): Record<string, string> {
  let mtime = 0;
  try {
    mtime = statSync(STRINGS_FILE).mtimeMs;
  } catch {
    return memory;
  }
  if (mtime !== loadedAt) {
    memory = JSON.parse(readFileSync(STRINGS_FILE, "utf8"));
    loadedAt = mtime;
  }
  return memory;
}

export function tr(text: string | null | undefined): string {
  if (!text) return "";
  const key = normText(text);
  return loadMemory()[key] ?? key;
}

export function hasTranslation(text: string | null | undefined) {
  return !!text && normText(text) in loadMemory();
}

export function trActivity(text: string) {
  const { name, rest } = splitActivity(text);
  const price = rest
    .replace(/\(included\)/i, "(incluído)")
    .replace(/\s*(?:-|–)\s*\$\s*([\d,]+)/, (_, n: string) => ` · US$ ${n.replace(/,/g, ".")}`)
    .replace(/\s*per person/i, " por pessoa");
  return tr(name) + price;
}

export function trHtml(html: string | null | undefined): string {
  if (!html) return "";
  const mem = loadMemory();
  const clean = cleanHtml(html);
  let found = false;
  const out = clean.replace(BLOCK, (whole, tag: string, inner: string) => {
    found = true;
    const pt = mem[normText(inner)];
    return pt ? `<${tag}>${pt}</${tag}>` : whole;
  });
  if (!found) return mem[normText(clean)] ?? clean;
  return out;
}
