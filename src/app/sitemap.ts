import type { MetadataRoute } from "next";
import { getAllFaqSlugs } from "@/lib/faqs";
import { getBoard } from "@/lib/lgp/source";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const board = await getBoard();
  const pages = ["", "/datas-e-precos", "/perguntas-frequentes", "/sobre", "/contato"];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "daily" as const })),
    ...board.trips.map((t) => ({ url: `${SITE_URL}/viagens/${t.slug}`, changeFrequency: "daily" as const })),
    ...getAllFaqSlugs().map((slug) => ({ url: `${SITE_URL}/perguntas-frequentes/${slug}`, changeFrequency: "monthly" as const })),
  ];
}
