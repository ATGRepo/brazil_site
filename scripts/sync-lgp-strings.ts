// Lista os textos das viagens que ainda não têm tradução.
//
//   npm run lgp:strings:check
//
// Lê o quadro de datas e o detalhe de cada viagem em letsgopolar.com, extrai os
// textos com as mesmas regras que as páginas usam e grava os que faltam em
// content/lgp/strings.pending.json, do mais usado para o menos usado.
// Depois de traduzir, junte o resultado em content/lgp/strings.pt.json com
// npm run lgp:strings:merge -- <arquivo.json>.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getBoard, getTrip } from "../src/lib/lgp/source";
import { STRINGS_FILE, boardUnits, cleanHtml, normText, tripUnits } from "../src/lib/lgp/translate";

const PENDING_FILE = path.join(process.cwd(), "content/lgp/strings.pending.json");

async function check() {
  const memory: Record<string, string> = JSON.parse(readFileSync(STRINGS_FILE, "utf8"));
  const board = await getBoard();
  const uses = new Map<string, number>();
  const count = (units: string[]) => {
    for (const unit of new Set(units)) uses.set(unit, (uses.get(unit) ?? 0) + 1);
  };

  for (const trip of board.trips) count(boardUnits(trip));

  const slugs = board.trips.map((t) => t.slug);
  let done = 0;
  const worker = async () => {
    for (let slug = slugs.shift(); slug; slug = slugs.shift()) {
      const detail = await getTrip(slug);
      if (detail) count(tripUnits(detail));
      if (++done % 100 === 0) console.log(`  ${done} viagens lidas`);
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));

  const all = [...uses.entries()];
  const pending = all
    .filter(([text]) => !(text in memory))
    .sort((a, b) => b[1] - a[1])
    .map(([text, n]) => ({ text, uses: n }));
  const words = (list: { text: string }[]) =>
    list.reduce((sum, u) => sum + u.text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length, 0);

  const translatedUses = all.filter(([t]) => t in memory).reduce((s, [, n]) => s + n, 0);
  const totalUses = all.reduce((s, [, n]) => s + n, 0);
  console.log(`${board.trips.length} viagens, ${all.length} textos únicos.`);
  console.log(`Traduzidos: ${all.length - pending.length}. Faltam: ${pending.length} (${words(pending)} palavras).`);
  console.log(`Cobertura pelo uso nas páginas: ${((100 * translatedUses) / totalUses).toFixed(1)}%.`);
  writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 1) + "\n");
  console.log(`Pendências: ${PENDING_FILE}`);
}

// Junta traduções novas (objeto { "inglês": "português" }) na memória.
function merge(file: string) {
  const memory: Record<string, string> = JSON.parse(readFileSync(STRINGS_FILE, "utf8"));
  const incoming: Record<string, string> = JSON.parse(readFileSync(file, "utf8"));
  const tags = (s: string) => (s.match(/<\/?[a-z0-9]+/gi) ?? []).map((t) => t.toLowerCase()).sort().join(" ");
  let added = 0;
  const rejected: string[] = [];
  for (const [en, pt] of Object.entries(incoming)) {
    const key = normText(en);
    const value = normText(cleanHtml(pt));
    if (!value || tags(key) !== tags(value)) {
      rejected.push(key.slice(0, 80));
      continue;
    }
    if (memory[key] !== value) added++;
    memory[key] = value;
  }
  const sorted = Object.fromEntries(Object.entries(memory).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(STRINGS_FILE, JSON.stringify(sorted, null, 1) + "\n");
  console.log(`${added} traduções gravadas. Rejeitadas (HTML diferente do original): ${rejected.length}`);
  for (const r of rejected.slice(0, 20)) console.log(`  ! ${r}`);
  if (rejected.length) process.exitCode = 1;
}

const [command, arg] = process.argv.slice(2);
if (command === "check") {
  check().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
} else if (command === "merge" && arg) {
  merge(arg);
} else {
  console.error("Uso: tsx scripts/sync-lgp-strings.ts check | merge <arquivo.json>");
  process.exit(2);
}
