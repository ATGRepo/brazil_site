// Integração das FAQs de letsgopolar.com com o banco do Destinos Polares.
//
// As FAQs são lidas da API pública do WordPress da Let's Go Polar, traduzidas
// para português e guardadas em content/lgp/faqs.pt.json. Esse arquivo é a
// fonte do que vai para o banco: a tradução é revisável no git e não depende
// de nenhuma chave de API.

import { readFileSync } from "node:fs";
import path from "node:path";
import type { PrismaClient } from "../../src/generated/prisma/client";

export const LGP_API = "https://letsgopolar.com/wp-json/wp/v2";
export const TRANSLATIONS_FILE = path.join(process.cwd(), "content/lgp/faqs.pt.json");
export const PENDING_FILE = path.join(process.cwd(), "content/lgp/faqs.pending.json");

// Categoria em letsgopolar.com -> nome em português, na ordem em que aparecem no site.
export const CATEGORIES: Record<string, string> = {
  "When to visit": "Quando ir",
  "Destinations and itineraries": "Destinos e roteiros",
  "The Drake Passage": "A Passagem de Drake",
  "Flights and getting there": "Voos e como chegar",
  "Ships and cabins": "Navios e cabines",
  "Choosing an operator": "Como escolher a operadora",
  "Cost and booking": "Preços e reservas",
  "Insurance, visas and policies": "Seguro, vistos e políticas",
  "Health and seasickness": "Saúde e enjoo",
  "Life onboard": "Vida a bordo",
  "Landings and activities": "Desembarques e atividades",
  Wildlife: "Vida selvagem",
  "Photography and connectivity": "Fotografia e conectividade",
  "Packing and gear": "O que levar",
  "Rules and responsible travel": "Regras e turismo responsável",
  "Arctic travel": "Viagens ao Ártico",
  Antarctic: "Antártica",
  "About Let's Go Polar": "Sobre a Let's Go Polar",
};

// Categorias importadas como rascunho (published = false) até alguém decidir publicá-las.
export const UNPUBLISHED_CATEGORIES = new Set(["About Let's Go Polar"]);

// FAQs de exemplo do seed original, removidas quando as FAQs reais entram.
const EXAMPLE_QUESTIONS = [
  "Qual a melhor época para viajar à Antártica?",
  "Preciso de visto para embarcar em Ushuaia?",
  "Como funcionam os desembarques em Zodiac?",
  "É preciso ter experiência prévia em cruzeiros de expedição?",
  "Como faço para solicitar uma reserva?",
];

export const FAQ_PATH = "/perguntas-frequentes";
const ALLOWED_TAGS = new Set([
  "p", "ul", "ol", "li", "b", "strong", "em", "i", "a", "br",
  "table", "thead", "tbody", "tr", "th", "td",
]);

const MONTHS: Record<string, string> = {
  January: "janeiro", February: "fevereiro", March: "março", April: "abril",
  May: "maio", June: "junho", July: "julho", August: "agosto",
  September: "setembro", October: "outubro", November: "novembro", December: "dezembro",
};

export type SourceFaq = {
  sourceId: number;
  sourceSlug: string;
  sourceModified: string;
  question: string;
  categories: string[];
  answer: string;
  details: string;
  sources: string[];
  checkedBy: string;
  checkedOn: string;
  related: string[];
};

export type TranslatedFaq = SourceFaq & { slug: string };

// ---------------------------------------------------------------------------
// Leitura de letsgopolar.com

type WpFaq = {
  id: number;
  slug: string;
  modified_gmt: string;
  title: { rendered: string };
  content: { rendered: string };
  "faq-category": number[];
};

async function fetchAll<T>(endpoint: string, fields: string): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${LGP_API}/${endpoint}?per_page=100&page=${page}&_fields=${fields}`);
    if (!res.ok) throw new Error(`${endpoint} página ${page}: HTTP ${res.status}`);
    out.push(...((await res.json()) as T[]));
    if (page >= Number(res.headers.get("x-wp-totalpages") ?? 1)) return out;
  }
}

function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

function block(html: string, cls: string, tag: string) {
  const m = html.match(new RegExp(`<${tag} class="${cls}">([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : "";
}

// Os blocos de resposta podem ter divs internas (tabelas vêm dentro de
// <div class="kc-tablewrap">), então um regex não guloso cortaria o bloco na
// primeira </div>. Aqui o bloco vai até o início do bloco seguinte e as divs
// internas são removidas.
function contentBlock(html: string, cls: string) {
  const start = html.indexOf(`<div class="${cls}">`);
  if (start === -1) return "";
  const from = start + `<div class="${cls}">`.length;
  const next = html.slice(from).search(/<(div|aside|nav) class="lgp-faq-/);
  const inner = next === -1 ? html.slice(from) : html.slice(from, from + next);
  return inner.replace(/<\/?div[^>]*>/g, "").trim();
}

function cleanHtml(html: string) {
  return html
    .replace(/\s(class|style|rel|target)="[^"]*"/g, "")
    .replace(/<a href="([^"]*)"[^>]*>/g, (_, url: string) => {
      const faq = url.match(/^https:\/\/letsgopolar\.com\/faqs\/([^/]+)\/?$/);
      return faq ? `<a href="faq:${faq[1]}">` : `<a href="${url}">`;
    })
    .replace(/\n+/g, "\n")
    .trim();
}

export async function fetchLgpFaqs(): Promise<SourceFaq[]> {
  const [items, cats] = await Promise.all([
    fetchAll<WpFaq>("faqs", "id,slug,modified_gmt,title,content,faq-category"),
    fetchAll<{ id: number; name: string }>("faq-category", "id,name"),
  ]);
  const catNames = new Map(cats.map((c) => [c.id, decodeEntities(c.name)]));

  return items.map((item) => {
    const html = item.content.rendered.replace(/<style[\s\S]*?<\/style>/g, "");
    const source = block(html, "lgp-faq-source", "aside");
    const related = block(html, "lgp-faq-related", "nav");
    return {
      sourceId: item.id,
      sourceSlug: item.slug,
      sourceModified: `${item.modified_gmt}Z`,
      question: decodeEntities(item.title.rendered),
      categories: item["faq-category"].map((id) => catNames.get(id) ?? String(id)),
      answer: cleanHtml(contentBlock(html, "lgp-faq-answer")),
      details: cleanHtml(contentBlock(html, "lgp-faq-more")),
      sources: [...source.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) =>
        decodeEntities(m[1].replace(/<[^>]+>/g, "")).trim(),
      ),
      checkedBy: source.match(/Checked by <strong>(.*?)<\/strong>/)?.[1] ?? "",
      checkedOn: source.match(/<\/strong>,\s*([^<.]+)/)?.[1].trim() ?? "",
      related: [...related.matchAll(/letsgopolar\.com\/faqs\/([^/"]+)\/?"/g)].map((m) => m[1]),
    };
  });
}

// ---------------------------------------------------------------------------
// Comparação entre letsgopolar.com e as traduções

export function loadTranslations(): TranslatedFaq[] {
  return JSON.parse(readFileSync(TRANSLATIONS_FILE, "utf8"));
}

export function compare(live: SourceFaq[], translated: TranslatedFaq[]) {
  const byId = new Map(translated.map((t) => [t.sourceId, t]));
  const liveIds = new Set(live.map((f) => f.sourceId));
  return {
    missing: live.filter((f) => !byId.has(f.sourceId)),
    outdated: live.filter((f) => {
      const t = byId.get(f.sourceId);
      return t && new Date(f.sourceModified) > new Date(t.sourceModified);
    }),
    removed: translated.filter((t) => !liveIds.has(t.sourceId)),
  };
}

// ---------------------------------------------------------------------------
// Gravação no banco

function assertSafeHtml(html: string, where: string) {
  for (const m of html.matchAll(/<\/?([a-z0-9]+)([^>]*)>/gi)) {
    const [tag, name, attrs] = m;
    if (!ALLOWED_TAGS.has(name.toLowerCase())) throw new Error(`${where}: tag não permitida ${tag}`);
    if (attrs.trim() && !/^\s*href="[^"]*"\s*$/.test(attrs)) {
      throw new Error(`${where}: atributo não permitido em ${tag}`);
    }
  }
}

function formatCheckedOn(date: string) {
  const m = date.match(/^(\d{1,2}) (\w+) (\d{4})$/);
  return m && MONTHS[m[2]] ? `${m[1]} de ${MONTHS[m[2]]} de ${m[3]}` : date;
}

export function validateTranslations(faqs: TranslatedFaq[]) {
  const slugs = new Set<string>();
  const ids = new Set<number>();
  for (const faq of faqs) {
    const where = `FAQ ${faq.sourceId} (${faq.sourceSlug})`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(faq.slug)) throw new Error(`${where}: slug inválido "${faq.slug}"`);
    if (slugs.has(faq.slug)) throw new Error(`${where}: slug repetido "${faq.slug}"`);
    if (ids.has(faq.sourceId)) throw new Error(`${where}: sourceId repetido`);
    if (!faq.question.trim() || !faq.answer.trim()) throw new Error(`${where}: pergunta ou resposta vazia`);
    const unknown = faq.categories.filter((c) => !(c in CATEGORIES));
    if (unknown.length) throw new Error(`${where}: categoria sem tradução ${unknown.join(", ")}`);
    assertSafeHtml(faq.answer, `${where} answer`);
    assertSafeHtml(faq.details, `${where} details`);
    slugs.add(faq.slug);
    ids.add(faq.sourceId);
  }
}

export async function importFaqs(prisma: PrismaClient, faqs: TranslatedFaq[]) {
  validateTranslations(faqs);

  const ptSlug = new Map(faqs.map((f) => [f.sourceSlug, f.slug]));
  const resolveLinks = (html: string) =>
    html
      .replace(/<a href="faq:([^"]+)">([\s\S]*?)<\/a>/g, (_, slug: string, text: string) =>
        ptSlug.has(slug) ? `<a href="${FAQ_PATH}/${ptSlug.get(slug)}">${text}</a>` : text,
      )
      .replace(/href="https:\/\/letsgopolar\.com\/trip-request-form\/?"/g, 'href="/contato"');

  const categoryOrder = Object.keys(CATEGORIES);
  const positions = new Map<string, number>();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const faq of faqs) {
    const sourceCategory = faq.categories[0] ?? "Antarctic";
    const position = positions.get(sourceCategory) ?? 0;
    positions.set(sourceCategory, position + 1);

    const data = {
      slug: faq.slug,
      category: CATEGORIES[sourceCategory],
      question: faq.question,
      answer: resolveLinks(faq.answer),
      details: faq.details ? resolveLinks(faq.details) : null,
      sources: JSON.stringify(faq.sources),
      checkedBy: faq.checkedBy || null,
      checkedOn: faq.checkedOn ? formatCheckedOn(faq.checkedOn) : null,
      related: JSON.stringify(faq.related.filter((s) => ptSlug.has(s)).map((s) => ptSlug.get(s))),
      order: categoryOrder.indexOf(sourceCategory) * 1000 + position,
      published: !UNPUBLISHED_CATEGORIES.has(sourceCategory),
      sourceSlug: faq.sourceSlug,
      sourceModified: new Date(faq.sourceModified),
    };

    const existing = await prisma.faqItem.findUnique({ where: { sourceId: faq.sourceId } });
    if (existing?.locked) {
      skipped++;
    } else if (existing) {
      // published fica como está: quem publicou ou despublicou à mão decide.
      const update: Partial<typeof data> = { ...data };
      delete update.published;
      await prisma.faqItem.update({ where: { id: existing.id }, data: update });
      updated++;
    } else {
      await prisma.faqItem.create({ data: { ...data, sourceId: faq.sourceId } });
      created++;
    }
  }

  const unpublished = await prisma.faqItem.updateMany({
    where: { sourceId: { notIn: faqs.map((f) => f.sourceId) }, NOT: { sourceId: null }, locked: false },
    data: { published: false },
  });
  const examples = await prisma.faqItem.deleteMany({
    where: { sourceId: null, question: { in: EXAMPLE_QUESTIONS } },
  });

  return { created, updated, skipped, unpublished: unpublished.count, examplesRemoved: examples.count };
}
