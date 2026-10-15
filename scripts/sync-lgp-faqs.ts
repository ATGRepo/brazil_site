// Sincroniza as FAQs de letsgopolar.com com o banco do Destinos Polares.
//
//   npm run lgp:faqs:check    compara letsgopolar.com com as traduções e grava
//                             o que falta traduzir em content/lgp/faqs.pending.json
//   npm run lgp:faqs:import   grava as traduções de content/lgp/faqs.pt.json no banco

import "dotenv/config";
import { writeFileSync, rmSync } from "node:fs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  PENDING_FILE,
  compare,
  fetchLgpFaqs,
  importFaqs,
  loadTranslations,
} from "./lgp/faqs";

async function check() {
  const live = await fetchLgpFaqs();
  const { missing, outdated, removed } = compare(live, loadTranslations());

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

async function runImport() {
  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" }),
  });
  try {
    const result = await importFaqs(prisma, loadTranslations());
    console.log(
      `FAQs: ${result.created} criadas, ${result.updated} atualizadas, ` +
        `${result.skipped} travadas (locked), ${result.unpublished} despublicadas, ` +
        `${result.examplesRemoved} de exemplo removidas.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

const command = process.argv[2];
const run = command === "check" ? check : command === "import" ? runImport : null;
if (!run) {
  console.error("Uso: tsx scripts/sync-lgp-faqs.ts <check|import>");
  process.exit(2);
}
run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
