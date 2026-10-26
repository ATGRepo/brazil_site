import type { Metadata } from "next";
import Link from "next/link";
import { getBoard, type BoardTrip } from "@/lib/lgp/source";
import { PageHero, TripMiniCard, discountOf } from "@/components/trip-mini-card";
import { formatUsd } from "@/lib/format";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Promoções",
  description: "Ofertas de última hora e descontos de reserva antecipada em expedições à Antártica e ao Ártico.",
};

const DAY = 86_400_000;

type Section = { title: string; note: string; trips: BoardTrip[] };

function daysUntil(iso: string) {
  return (new Date(`${iso}T00:00:00Z`).getTime() - Date.now()) / DAY;
}

function topDiscounts(list: BoardTrip[], n = 8) {
  return list
    .filter((t) => discountOf(t) > 0)
    .sort((a, b) => discountOf(b) - discountOf(a) || a.start.localeCompare(b.start))
    .slice(0, n);
}

function bestOff(list: BoardTrip[]) {
  const best = Math.max(0, ...list.map(discountOf));
  return best > 0 ? `até ${Math.round(best * 100)}% off` : "";
}

function cheapestFrom(list: BoardTrip[]) {
  const min = Math.min(...list.map((t) => t.from ?? Number.POSITIVE_INFINITY));
  return Number.isFinite(min) ? `a partir de ${formatUsd(min)}` : "";
}

function cheapest(list: BoardTrip[], n = 8) {
  return [...list].filter((t) => t.from).sort((a, b) => (a.from ?? 0) - (b.from ?? 0)).slice(0, n);
}

export default async function PromotionsPage() {
  const board = await getBoard();
  const open = board.trips.filter((t) => t.avail > 0 && daysUntil(t.start) > 0);
  const discounted = open.filter((t) => discountOf(t) > 0);
  const ant = open.filter((t) => t.region === "Antarctic");
  const arc = open.filter((t) => t.region === "Arctic");
  const has = (t: BoardTrip, place: RegExp) => [...t.dest, ...t.fdest].some((d) => place.test(d));

  const groups: { pole: string; sections: Section[] }[] = [
    {
      pole: "Os dois polos",
      sections: [
        (() => {
          const trips = topDiscounts(open.filter((t) => daysUntil(t.start) <= 30), 12);
          return { title: "Última hora, saindo em até 30 dias", note: cheapestFrom(trips), trips };
        })(),
        (() => {
          const trips = open.filter((t) => t.charter || t.group).sort((a, b) => a.start.localeCompare(b.start));
          return { title: "Viagens em grupo e fretamentos da ATG", note: cheapestFrom(trips), trips };
        })(),
      ],
    },
    {
      pole: "Antártica",
      sections: [
        { list: ant.filter((t) => daysUntil(t.start) <= 120), title: "Última hora" },
        { list: ant.filter((t) => daysUntil(t.start) > 300), title: "Reserva antecipada" },
        { list: ant.filter((t) => discountOf(t) >= 0.2), title: "20% off ou mais" },
        { list: ant.filter((t) => (t.from ?? Infinity) < 10_000), title: "Abaixo de US$ 10.000" },
        { list: ant.filter((t) => has(t, /South Georgia/i)), title: "Geórgia do Sul" },
      ]
        .map(({ list, title }) => {
          const trips = topDiscounts(list);
          return { title, note: bestOff(trips), trips };
        })
        .concat([{ title: "As 8 mais baratas", note: cheapestFrom(ant), trips: cheapest(ant) }]),
    },
    {
      pole: "Ártico",
      sections: [
        { list: arc.filter((t) => daysUntil(t.start) > 300), title: "Reserva antecipada" },
        { list: arc.filter((t) => has(t, /Svalbard|Spitsbergen/i)), title: "Ursos-polares, Svalbard" },
        { list: arc.filter((t) => has(t, /Greenland/i)), title: "Groenlândia" },
        { list: arc.filter((t) => has(t, /Iceland/i)), title: "Islândia" },
        { list: arc.filter((t) => (t.from ?? Infinity) < 10_000), title: "Abaixo de US$ 10.000" },
      ]
        .map(({ list, title }) => {
          const trips = topDiscounts(list);
          return { title, note: bestOff(trips), trips };
        })
        .concat([{ title: "As 8 mais baratas", note: cheapestFrom(arc), trips: cheapest(arc) }]),
    },
  ];

  return (
    <>
      <PageHero eyebrow="As promoções estão no ar" title="Ofertas de última hora e descontos de reserva antecipada">
        <p>
          Temos {open.length} saídas polares à venda, e {discounted.length} delas estão com desconto hoje. Comece pelas
          categorias abaixo ou peça as ofertas que não podemos publicar.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-base">
          <Link href="/pedido-de-viagem" className="rounded-md bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark">
            Pergunte sobre ofertas exclusivas
          </Link>
          <Link href="/lista-vip" className="rounded-md border-2 border-white/80 px-5 py-3 font-semibold hover:bg-white/10">
            Entre na lista VIP
          </Link>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Os preços são definidos pelas operadoras e mudam com a procura, às vezes de um dia para o outro. Valores em
          dólar, por pessoa.
        </p>
        {groups.map((group) => (
          <section key={group.pole} className="mt-12">
            <h2 className="border-b border-border pb-3 text-3xl font-bold text-primary">{group.pole}</h2>
            {group.sections
              .filter((s) => s.trips.length > 0)
              .map((s) => (
                <div key={s.title} className="mt-10">
                  <h3 className="text-xl font-bold text-primary">{s.title}</h3>
                  {s.note && <p className="text-sm text-accent">{s.note}</p>}
                  <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {s.trips.map((t) => (
                      <TripMiniCard key={t.slug} trip={t} />
                    ))}
                  </div>
                </div>
              ))}
          </section>
        ))}
      </div>
    </>
  );
}
