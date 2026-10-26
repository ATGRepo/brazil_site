// Navios, operadoras, avaliações e depoimentos, dos JSON públicos de letsgopolar.com.

import { LGP_ORIGIN, REVALIDATE_SECONDS } from "./source";
import type { TripCabin } from "./source";

async function getJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`${LGP_ORIGIN}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

const SLUG = /^[a-z0-9-]+$/;

export type ShipCard = { slug: string; name: string; type: string; photo: string | null; operator: string };
export type CompanyCard = { slug: string; name: string; logo: string | null };

export type Ship = {
  slug: string;
  name: string;
  type: string | null;
  capacity: number | string | null;
  year_build: number | string | null;
  tracker_url: string | null;
  description: string | null;
  practical_info: string | null;
  facilities: string[];
  deckplan: string | null;
  gallery: string[];
  operator: { name: string; slug: string } | null;
  cabins: TripCabin[];
};

export type Company = { slug: string; name: string; description: string | null; logo: string | null; banner: string | null };

export type Review = {
  slug: string;
  person: string;
  operator: string;
  ship: string;
  region: string;
  itinerary: string;
  sailed: { month: string; year: number; key: number };
  overall: number;
  booked_with_atg: boolean;
  photo: string | null;
  animals: string[];
  excerpt: string;
};

export type Testimonial = {
  person: string;
  text: string;
  region: string;
  ship: string;
  operator: string;
  year: number;
  slug: string;
};

export async function getShips() {
  return (await getJson<{ ships: ShipCard[] }>("/all-ships-proto/ships.json"))?.ships ?? [];
}

export async function getShip(slug: string) {
  return SLUG.test(slug) ? getJson<Ship>(`/ship-proto/data/${slug}.json`) : null;
}

export async function getCompanies() {
  return (await getJson<{ operators: CompanyCard[] }>("/company-proto/companies.json"))?.operators ?? [];
}

export async function getCompany(slug: string) {
  return SLUG.test(slug) ? getJson<Company>(`/company-proto/data/${slug}.json`) : null;
}

export async function getReviews() {
  return (await getJson<{ reviews: Review[] }>("/reviews-proto/reviews.json"))?.reviews ?? [];
}

export async function getTestimonials() {
  return (await getJson<{ quotes: Testimonial[] }>("/testimonials-proto/testimonials.json"))?.quotes ?? [];
}

// Nomes de navio e operadora variam entre os arquivos ("m/v Hondius" e
// "Hondius", "Antarpply" e "Antarpply Expeditions").
export function sameName(a: string, b: string) {
  const n = (s: string) =>
    s
      .toLowerCase()
      .replace(/^(m\/v|m\/s|mv|ms|sh|the)\s+/, "")
      .replace(/\b(expeditions?|cruises?)\b/g, "")
      .replace(/[^a-z0-9]/g, "");
  return n(a) === n(b);
}
