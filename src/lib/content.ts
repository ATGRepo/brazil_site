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

export type ItineraryDay = { day: string; title: string; description: string };

export function parseItinerary(value: string | null | undefined): ItineraryDay[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatPrice(price: number | null | undefined, currency: string) {
  if (price == null) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export async function getPublishedDestinations() {
  return prisma.destination.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getDestinationBySlug(slug: string) {
  return prisma.destination.findUnique({
    where: { slug, published: true },
    include: {
      expeditions: {
        include: { expedition: true },
      },
    },
  });
}

export async function getPublishedExpeditions() {
  return prisma.expedition.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { vessel: true, destinations: { include: { destination: true } } },
  });
}

export async function getFeaturedExpeditions() {
  return prisma.expedition.findMany({
    where: { published: true, featured: true },
    orderBy: { order: "asc" },
    include: { vessel: true, destinations: { include: { destination: true } } },
  });
}

export async function getExpeditionBySlug(slug: string) {
  return prisma.expedition.findUnique({
    where: { slug, published: true },
    include: { vessel: true, destinations: { include: { destination: true } } },
  });
}

export async function getPublishedVessels() {
  return prisma.vessel.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });
}

export async function getVesselBySlug(slug: string) {
  return prisma.vessel.findUnique({
    where: { slug, published: true },
    include: { expeditions: { where: { published: true } } },
  });
}

export async function getPublishedFaqItems() {
  const items = await prisma.faqItem.findMany({
    where: { published: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
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
