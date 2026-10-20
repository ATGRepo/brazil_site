// Leitura das FAQs de letsgopolar.com, para comparar com as traduções.
// A montagem das FAQs que o site mostra fica em src/lib/faqs.ts.

import path from "node:path";
import type { SourceFaq, TranslatedFaq } from "../../src/lib/faqs";

export const LGP_API = "https://letsgopolar.com/wp-json/wp/v2";
export const PENDING_FILE = path.join(process.cwd(), "content/lgp/faqs.pending.json");

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

