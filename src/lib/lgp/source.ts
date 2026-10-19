// Dados das viagens, lidos dos JSON públicos de letsgopolar.com.
// O servidor da Let's Go Polar refaz esses arquivos a cada 15 minutos, então o
// cache aqui dura o mesmo tempo. Nada é gravado do lado da Let's Go Polar.

export const LGP_ORIGIN = "https://letsgopolar.com";
export const REVALIDATE_SECONDS = 900;

export type BoardActivity = { text: string; price: number };

export type BoardTrip = {
  slug: string;
  title: string;
  operator: string;
  ship: string;
  start: string;
  end: string;
  days: number;
  embark: string;
  disembark: string;
  region: "Antarctic" | "Arctic" | string;
  month: number;
  dest: string[];
  fdest: string[];
  specialty: string[];
  activityTags: string[];
  activityNotes?: Record<string, string>;
  fly: number;
  group: number;
  allInc: number;
  charter: number;
  avail: number;
  cabins: number;
  from: number | null;
  wasFrom: number | null;
  fareLabel: string | null;
  promotion_text: string | null;
  acts: BoardActivity[];
  hero: string | null;
  heroAlt: string | null;
  soldOut: number;
};

export type Board = {
  feed_updated: string;
  count: number;
  trips: BoardTrip[];
};

export type FeedCabin = { name: string; full: number | null; disc: number | null; available: boolean };

export type TripCabin = {
  name: string;
  description: string | null;
  photo: string | null;
  passengers: number | string | null;
  size: string | null;
  view: string | null;
};

export type TripDetail = {
  feed_updated: string;
  target: {
    meta: {
      id: number;
      slug: string;
      title: string;
      start_date: string;
      return_date: string;
      duration: number;
      embarcation: string;
      disembarcation: string;
      supplier: string;
      ship_card: string;
    };
    featured: string | null;
    gallery: string[];
    itinerary: { title: string; html: string }[];
    things_to_do: { name: string; html: string; photo: string | null; photo_alt: string | null }[];
    faqs: { q: string; a: string; cat: string }[];
    cabins: TripCabin[];
    ship: {
      name: string;
      photo: string | null;
      type: string | null;
      year_build: string | number | null;
      capacity: string | number | null;
      deckplan: string | null;
      description: string | null;
      facilities: string[];
      practical_info: string | null;
    } | null;
    operator: {
      name: string;
      slug: string;
      logo: string | null;
      payment_terms: string | null;
      missing_cabin_policy?: string | null;
    } | null;
    terms: { taxonomy: string; name: string; slug: string }[];
  };
  feed: {
    operator: string;
    ship: string;
    start: string;
    end: string;
    days: number;
    region: string;
    activities: BoardActivity[];
    availCount: number;
    cabinCount: number;
    fromPrice: number | null;
    fromFull: number | null;
    cabins: FeedCabin[];
  } | null;
  alias?: Record<string, string>;
  ship_vocab?: string[];
};

async function getJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`${LGP_ORIGIN}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function getBoard() {
  return getJson<Board>("/dates-board/browse.json") as Promise<Board>;
}

export function getTrip(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return Promise.resolve(null);
  return getJson<TripDetail>(`/all-trips/data/${slug}.json`);
}
