import type { MetadataRoute } from "next";
import { getAllFaqSlugs } from "@/lib/faqs";
import { getBoard } from "@/lib/lgp/source";
import { SITE_URL } from "@/lib/site";
import { getCompanies, getShips } from "@/lib/lgp/fleet";
import { getLgpPosts } from "@/lib/lgp/article";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const board = await getBoard();
  const pages = [
    "", "/datas-e-precos", "/promocoes", "/viagens-em-grupo", "/lista-vip", "/navios", "/operadoras",
    "/avaliacoes", "/sobre", "/depoimentos", "/passagem-de-drake", "/perguntas-frequentes", "/ciencia-cidada",
    "/blog", "/o-que-levar", "/the-drake-shake", "/contato", "/pedido-de-viagem",
  ];
  const [ships, companies, posts] = await Promise.all([getShips(), getCompanies(), getLgpPosts()]);
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "daily" as const })),
    ...board.trips.map((t) => ({ url: `${SITE_URL}/viagens/${t.slug}`, changeFrequency: "daily" as const })),
    ...ships.map((s) => ({ url: `${SITE_URL}/navios/${s.slug}`, changeFrequency: "weekly" as const })),
    ...companies.map((c) => ({ url: `${SITE_URL}/operadoras/${c.slug}`, changeFrequency: "weekly" as const })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, changeFrequency: "monthly" as const })),
    ...getAllFaqSlugs().map((slug) => ({ url: `${SITE_URL}/perguntas-frequentes/${slug}`, changeFrequency: "monthly" as const })),
  ];
}
