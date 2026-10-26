// Páginas de texto clonadas de letsgopolar.com: onde ficam aqui e de onde vêm.
// O script lgp:strings:check usa esta mesma lista para achar os textos sem tradução.

import { loadTranslations } from "@/lib/faqs";
import { cleanArticle, getLgpPage, getLgpPosts } from "./article";
import { localHref } from "./routes";
import { tr, trHtml } from "./translate";

export type ArticleSource = { slug: string; type: "pages" | "posts" };

export const ARTICLES = {
  packing: { slug: "how-to-pack-for-arctic-and-antarctica", type: "pages" },
  drake: { slug: "learn-about-drake-passage", type: "pages" },
  citizenScience: { slug: "citizen-science-program", type: "posts" },
  drakeShake: { slug: "the-drake-shake", type: "pages" },
  vip: { slug: "vip-deals-list", type: "pages" },
  giveaway: { slug: "atg-giveaway", type: "pages" },
} satisfies Record<string, ArticleSource>;

async function linkMapper() {
  const faqMap = new Map(loadTranslations().map((f) => [f.sourceSlug, f.slug]));
  const posts = new Set((await getLgpPosts()).map((p) => p.slug));
  return (href: string) => localHref(href, (s) => faqMap.get(s), posts);
}

// Versão limpa, ainda em inglês: base para tradução e para o script de pendências.
export async function getCleanArticle(source: ArticleSource) {
  const page = await getLgpPage(source.slug, source.type);
  if (!page) return null;
  return { ...page, html: cleanArticle(page.html, await linkMapper()) };
}

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contato@destinospolares.com.br";

// Versão traduzida, para as páginas. O email geral da ATG vira o do Destinos
// Polares, para o cliente brasileiro escrever para a caixa certa.
export async function getTranslatedArticle(source: ArticleSource) {
  const page = await getCleanArticle(source);
  if (!page) return null;
  const html = trHtml(page.html).replace(/info@antarcticatravelgroup\.com/g, CONTACT_EMAIL);
  return { ...page, title: tr(page.title), html };
}
