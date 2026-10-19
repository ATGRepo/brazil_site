import { prisma } from "@/lib/prisma";

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getPublishedFaqItems() {
  const items = await prisma.faqItem.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { question: "asc" }],
  });

  const byCategory = new Map<string, typeof items>();
  for (const item of items) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }
  return Array.from(byCategory.entries()).map(([category, questions]) => ({
    category,
    questions,
  }));
}

export async function getFaqItemBySlug(slug: string) {
  return prisma.faqItem.findUnique({ where: { slug, published: true } });
}

export async function getFaqItemsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  const items = await prisma.faqItem.findMany({
    where: { slug: { in: slugs }, published: true },
    select: { slug: true, question: true },
  });
  return slugs.flatMap((slug) => items.filter((item) => item.slug === slug));
}
