// Compara as FAQs de letsgopolar.com com as traduções.
//
//   npm run lgp:faqs:check   lista FAQs novas, alteradas e removidas em
//                            letsgopolar.com e grava o texto em inglês do que
//                            falta traduzir em content/lgp/faqs.pending.json
//
// O site lê content/lgp/faqs.pt.json direto, então uma tradução nova aparece
// assim que o arquivo é atualizado. A checagem também valida esse arquivo.

import { writeFileSync, rmSync } from "node:fs";
import { buildFaqs, loadTranslations } from "../src/lib/faqs";
import { PENDING_FILE, compare, fetchLgpFaqs } from "./lgp/faqs";

async function check() {
  const translations = loadTranslations();
  buildFaqs(translations);

  const live = await fetchLgpFaqs();
  const { missing, outdated, removed } = compare(live, translations);

  console.log(`letsgopolar.com: ${live.length} FAQs`);
  console.log(`Sem tradução: ${missing.length}`);
  for (const f of missing) console.log(`  + ${f.sourceSlug}`);
  console.log(`Alteradas depois da tradução: ${outdated.length}`);
  for (const f of outdated) console.log(`  ~ ${f.sourceSlug}`);
  console.log(`Removidas de letsgopolar.com: ${removed.length}`);
  for (const f of removed) console.log(`  - ${f.sourceSlug}`);

  const pending = [...missing, ...outdated];
  if (pending.length) {
    writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 1) + "\n");
    console.log(`\nTextos em inglês para traduzir: ${PENDING_FILE}`);
    process.exitCode = 1;
  } else {
    rmSync(PENDING_FILE, { force: true });
    console.log("\nTraduções em dia.");
  }
}

check().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
