// Perguntas frequentes do Destinos Polares.
//
// São traduções das FAQs de letsgopolar.com, guardadas em
// content/lgp/faqs.pt.json. Não há banco de dados: as páginas leem esse arquivo.
// npm run lgp:faqs:check mostra o que mudou em letsgopolar.com desde a tradução.

import { readFileSync, statSync } from "node:fs";
import path from "node:path";

export const TRANSLATIONS_FILE = path.join(process.cwd(), "content/lgp/faqs.pt.json");
export const FAQ_PATH = "/perguntas-frequentes";

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

// Categorias que não aparecem no site até alguém decidir publicá-las.
export const UNPUBLISHED_CATEGORIES = new Set(["About Let's Go Polar"]);

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

export type Faq = {
  slug: string;
  category: string;
  question: string;
  answer: string;
  details: string | null;
  sources: string[];
  checkedBy: string | null;
  checkedOn: string | null;
  related: string[];
  order: number;
  published: boolean;
};

export function loadTranslations(): TranslatedFaq[] {
  return JSON.parse(readFileSync(TRANSLATIONS_FILE, "utf8"));
}

// Monta as FAQs que as páginas mostram: categoria em português, links entre
// FAQs apontando para as páginas daqui e o formulário da Let's Go Polar
// trocado pelo nosso contato.
export function buildFaqs(translations: TranslatedFaq[]): Faq[] {
  validateTranslations(translations);
  const ptSlug = new Map(translations.map((f) => [f.sourceSlug, f.slug]));
  const resolveLinks = (html: string) =>
    html
      .replace(/<a href="faq:([^"]+)">([\s\S]*?)<\/a>/g, (_, slug: string, text: string) =>
        ptSlug.has(slug) ? `<a href="${FAQ_PATH}/${ptSlug.get(slug)}">${text}</a>` : text,
      )
      .replace(/href="https:\/\/letsgopolar\.com\/trip-request-form\/?"/g, 'href="/contato"');

  const categoryOrder = Object.keys(CATEGORIES);
  const positions = new Map<string, number>();
  return translations.map((faq) => {
    const sourceCategory = faq.categories[0] ?? "Antarctic";
    const position = positions.get(sourceCategory) ?? 0;
    positions.set(sourceCategory, position + 1);
    return {
      slug: faq.slug,
      category: CATEGORIES[sourceCategory],
      question: faq.question,
      answer: resolveLinks(faq.answer),
      details: faq.details ? resolveLinks(faq.details) : null,
      sources: faq.sources,
      checkedBy: faq.checkedBy || null,
      checkedOn: faq.checkedOn ? formatCheckedOn(faq.checkedOn) : null,
      related: faq.related.filter((s) => ptSlug.has(s)).map((s) => ptSlug.get(s)!),
      order: categoryOrder.indexOf(sourceCategory) * 1000 + position,
      published: !UNPUBLISHED_CATEGORIES.has(sourceCategory),
    };
  });
}

let cache: { mtime: number; faqs: Faq[] } | null = null;

function publishedFaqs(): Faq[] {
  const mtime = statSync(TRANSLATIONS_FILE).mtimeMs;
  if (!cache || cache.mtime !== mtime) {
    const faqs = buildFaqs(loadTranslations())
      .filter((f) => f.published)
      .sort((a, b) => a.order - b.order);
    cache = { mtime, faqs };
  }
  return cache.faqs;
}

export function getFaqGroups() {
  const byCategory = new Map<string, Faq[]>();
  for (const faq of publishedFaqs()) {
    const list = byCategory.get(faq.category) ?? [];
    list.push(faq);
    byCategory.set(faq.category, list);
  }
  return [...byCategory.entries()].map(([category, questions]) => ({ category, questions }));
}

export function getFaq(slug: string) {
  return publishedFaqs().find((f) => f.slug === slug) ?? null;
}

export function getFaqsBySlugs(slugs: string[]) {
  const all = publishedFaqs();
  return slugs.flatMap((s) => all.filter((f) => f.slug === s));
}

export function getFirstFaqs(count: number) {
  return publishedFaqs().slice(0, count);
}

export function getAllFaqSlugs() {
  return publishedFaqs().map((f) => f.slug);
}
