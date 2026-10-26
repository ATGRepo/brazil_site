// Páginas de texto copiadas de letsgopolar.com (lista do que levar, Passagem de
// Drake, ciência cidadã, posts do blog e outras).
//
// O HTML vem do construtor de páginas do WordPress, com dezenas de divs, spans
// e ícones em volta de cada parágrafo. cleanArticle deixa só a estrutura de
// texto (títulos, parágrafos, listas, tabelas, perguntas abertas e fechadas,
// imagens) e troca os links da Let's Go Polar pelas páginas daqui. A tradução
// usa a mesma memória dos textos das viagens (trHtml), parágrafo por parágrafo.

import { parse, HTMLElement, Node, NodeType, TextNode } from "node-html-parser";
import { LGP_ORIGIN, REVALIDATE_SECONDS } from "./source";
import { localHref } from "./routes";

const DROP = new Set([
  "script", "style", "svg", "noscript", "form", "button", "input", "select", "textarea",
  "label", "link", "meta", "template", "video", "audio", "source", "canvas", "nav",
]);

const KEEP: Record<string, string[]> = {
  h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
  p: [], ul: [], ol: [], li: [], blockquote: [], hr: [], br: [],
  a: ["href"], strong: [], b: [], em: [], i: [], u: [], s: [],
  img: ["src", "alt", "width", "height"], figure: [], figcaption: [],
  details: ["open"], summary: [],
  table: [], thead: [], tbody: [], tr: [], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"],
  iframe: ["src", "width", "height", "title"],
};

const BLOCK_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "blockquote", "hr", "figure", "details", "table", "iframe",
]);

const IFRAME_HOSTS = [
  "www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com",
  "embed.windy.com", "open.spotify.com", "embed.podcasts.apple.com",
];

export type LinkMapper = (href: string) => string;

// Entidades viram caracteres (as chaves da tradução ficam legíveis), menos as
// que precisam continuar escapadas no HTML.
function decodeText(raw: string) {
  return raw
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/[<>]/g, (c) => (c === "<" ? "&lt;" : "&gt;"));
}

function imgSrc(el: HTMLElement) {
  const src =
    el.getAttribute("data-lazy-src") || el.getAttribute("data-src") || el.getAttribute("src") || "";
  return src.startsWith("data:") ? "" : src;
}

function hasWords(text: string) {
  return /[A-Za-z]{2}/.test(text);
}

function isInline(node: Node) {
  if (node.nodeType === NodeType.TEXT_NODE) return true;
  const tag = (node as HTMLElement).tagName?.toLowerCase();
  return !!tag && !BLOCK_TAGS.has(tag) && tag !== "summary";
}

// Reconstrói a árvore só com as tags de KEEP. O resto é desembrulhado.
function rebuild(node: Node, mapLink: LinkMapper): string {
  if (node.nodeType === NodeType.TEXT_NODE) return decodeText((node as TextNode).rawText);
  if (node.nodeType !== NodeType.ELEMENT_NODE) return "";
  const el = node as HTMLElement;
  const tag = el.tagName?.toLowerCase() ?? "";
  if (DROP.has(tag)) return "";
  if (el.getAttribute("aria-hidden") === "true") return "";

  if (tag === "img") {
    const src = imgSrc(el);
    if (!src) return "";
    const alt = (el.getAttribute("alt") ?? "").replace(/"/g, "&quot;");
    return `<img src="${src}" alt="${alt}" loading="lazy">`;
  }
  if (tag === "iframe") {
    const src = el.getAttribute("src") ?? "";
    try {
      if (!IFRAME_HOSTS.includes(new URL(src, LGP_ORIGIN).hostname)) return "";
    } catch {
      return "";
    }
    return `<iframe src="${src}" loading="lazy" allowfullscreen></iframe>`;
  }
  if (tag === "summary") return `<summary>${decodeText(el.rawText).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()}</summary>`;

  const inner = rebuildChildren(el, mapLink, tag === "details");
  if (!(tag in KEEP)) return inner;
  if (tag === "br" || tag === "hr") return `<${tag}>`;
  const attrs = KEEP[tag]
    .map((name) => {
      let value = el.getAttribute(name);
      if (value == null) return "";
      if (name === "href") value = mapLink(value);
      return ` ${name}="${value.replace(/"/g, "&quot;")}"`;
    })
    .join("");
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

// Em níveis que só deveriam ter blocos (a raiz e o corpo de um details), texto
// solto e links soltos viram parágrafos, para poderem ser traduzidos.
function rebuildChildren(el: HTMLElement, mapLink: LinkMapper, blockLevel: boolean): string {
  if (!blockLevel) return el.childNodes.map((c) => rebuild(c, mapLink)).join("");
  let out = "";
  let run = "";
  const flush = () => {
    if (hasWords(run.replace(/<[^>]+>/g, ""))) out += `<p>${run.trim()}</p>`;
    else if (/<img /.test(run)) out += run;
    run = "";
  };
  for (const child of flatten(el)) {
    if (isInline(child)) run += rebuild(child, mapLink);
    else {
      flush();
      out += rebuild(child, mapLink);
    }
  }
  flush();
  return out;
}

// Desce pelos wrappers (div, span, section) até achar os elementos que contam.
function flatten(el: HTMLElement): Node[] {
  const out: Node[] = [];
  for (const child of el.childNodes) {
    if (child.nodeType === NodeType.ELEMENT_NODE) {
      const c = child as HTMLElement;
      const tag = c.tagName?.toLowerCase() ?? "";
      if (DROP.has(tag) || c.getAttribute("aria-hidden") === "true") continue;
      if (!(tag in KEEP) && containsBlock(c)) {
        out.push(...flatten(c));
        continue;
      }
    }
    out.push(child);
  }
  return out;
}

function containsBlock(el: HTMLElement): boolean {
  return el.querySelectorAll("*").some((d) => BLOCK_TAGS.has(d.tagName?.toLowerCase() ?? "") || d.tagName === "SUMMARY");
}

export function cleanArticle(html: string, mapLink: LinkMapper = (h) => localHref(h)) {
  const root = parse(html, { comment: false, blockTextElements: { script: false, style: false } });
  return rebuildChildren(root, mapLink, true)
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .trim();
}

// ---------------------------------------------------------------------------
// Leitura

export type LgpPage = { id: number; slug: string; title: string; html: string; modified: string };

type WpItem = {
  id: number;
  slug: string;
  modified_gmt: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  date_gmt?: string;
  featured_media?: number;
  _embedded?: { "wp:featuredmedia"?: { source_url?: string }[] };
};

function decode(text: string) {
  return parse(text).text.trim();
}

async function fetchWp<T>(path: string): Promise<T> {
  const res = await fetch(`${LGP_ORIGIN}/wp-json/wp/v2/${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

export async function getLgpPage(slug: string, type: "pages" | "posts" = "pages"): Promise<LgpPage | null> {
  const items = await fetchWp<WpItem[]>(`${type}?slug=${encodeURIComponent(slug)}&_fields=id,slug,modified_gmt,title,content`);
  const item = items[0];
  if (!item) return null;
  return {
    id: item.id,
    slug: item.slug,
    title: decode(item.title.rendered),
    html: item.content.rendered,
    modified: item.modified_gmt,
  };
}

export type LgpPostSummary = { slug: string; title: string; excerpt: string; date: string; image: string | null };

export async function getLgpPosts(): Promise<LgpPostSummary[]> {
  const items = await fetchWp<WpItem[]>(
    "posts?per_page=100&_embed=wp:featuredmedia&_fields=id,slug,date_gmt,title,excerpt,_links,_embedded",
  );
  return items.map((p) => ({
    slug: p.slug,
    title: decode(p.title.rendered),
    excerpt: decode(p.excerpt?.rendered ?? ""),
    date: p.date_gmt ?? "",
    image: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
  }));
}
