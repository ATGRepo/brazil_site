import type { Metadata } from "next";
import Link from "next/link";
import { getReviews } from "@/lib/lgp/fleet";
import { tr } from "@/lib/lgp/translate";
import { PageHero } from "@/components/trip-mini-card";
import { MONTHS_LONG, REGION_PT } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Avaliações polares",
  description: "O que os nossos viajantes contam depois de voltar da Antártica e do Ártico.",
};

const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ANIMALS: Record<string, string> = {
  penguins: "pinguins",
  whales: "baleias",
  seals: "focas",
  "polar bears": "ursos-polares",
  "polar-bears": "ursos-polares",
  walrus: "morsas",
  reindeer: "renas",
  birds: "aves",
  "arctic fox": "raposa-do-ártico",
  albatross: "albatrozes",
  orcas: "orcas",
};

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} de 5 estrelas`} className="text-[#f5a623]">
      {"★".repeat(Math.round(n))}
      <span className="text-border">{"★".repeat(5 - Math.round(n))}</span>
    </span>
  );
}

export default async function ReviewsPage() {
  const reviews = (await getReviews()).sort((a, b) => b.sailed.key - a.sailed.key);
  const avg = reviews.reduce((s, r) => s + r.overall, 0) / (reviews.length || 1);

  return (
    <>
      <PageHero eyebrow="Avaliações polares" title="O que os nossos viajantes contam">
        <p>
          {reviews.length} avaliações de quem já viajou, com nota média de {avg.toFixed(1).replace(".", ",")} de 5. Os
          textos foram traduzidos do inglês.
        </p>
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {reviews.map((r) => {
          const month = EN_MONTHS.indexOf(r.sailed.month);
          return (
            <article key={r.slug} className="flex flex-col overflow-hidden rounded-xl border border-border bg-white">
              {r.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <Stars n={r.overall} />
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground">&ldquo;{tr(r.excerpt)}&rdquo;</p>
                <p className="mt-4 font-semibold text-primary">{r.person}</p>
                <p className="text-sm text-muted-foreground">
                  {REGION_PT[r.region] ?? r.region}
                  {r.itinerary ? ` · ${tr(r.itinerary)}` : ""} · {r.ship}
                </p>
                <p className="text-xs text-muted-foreground">
                  {month >= 0 ? `${MONTHS_LONG[month]} de ${r.sailed.year}` : r.sailed.year}
                  {r.animals.length > 0 && ` · viu ${r.animals.map((a) => ANIMALS[a] ?? a).join(", ")}`}
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <Link href="/depoimentos" className="font-semibold text-accent hover:underline">
          Leia também os depoimentos sobre o nosso atendimento →
        </Link>
      </div>
    </>
  );
}
