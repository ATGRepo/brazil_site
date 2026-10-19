import Link from "next/link";
import { getBoard, type BoardTrip } from "@/lib/lgp/source";
import { tr } from "@/lib/lgp/translate";
import { prisma } from "@/lib/prisma";
import { formatDateRange, formatUsd } from "@/lib/format";

export const revalidate = 900;

const HERO_IMAGE = "https://letsgopolar.com/wp-content/uploads/2026/08/AAKayakD1Fuji-Neill-4141.jpg";

const REGIONS = [
  {
    key: "Antarctic",
    name: "Antártica",
    image: "https://letsgopolar.com/wp-content/uploads/2026/08/AntarcticaMoonrise--1024x683.jpg",
    text: "Península Antártica, Geórgia do Sul, Ilhas Malvinas, Mar de Weddell e o Círculo Polar. Temporada de outubro a março.",
  },
  {
    key: "Arctic",
    name: "Ártico",
    image:
      "https://letsgopolar.com/wp-content/uploads/2026/04/Polar-bear-at-Freemansundet-©-Geert-Kroes-Oceanwide-Expeditions.jpg_Geert-Kroes-scaled-1024x682.jpeg",
    text: "Svalbard, Groenlândia, Islândia e o Ártico canadense. Temporada de maio a setembro.",
  },
];

function discount(t: BoardTrip) {
  return t.from && t.wasFrom && t.wasFrom > t.from ? 1 - t.from / t.wasFrom : 0;
}

export default async function HomePage() {
  const [board, faqs] = await Promise.all([
    getBoard(),
    prisma.faqItem.findMany({
      where: { published: true, slug: { not: null } },
      orderBy: { order: "asc" },
      take: 6,
      select: { slug: true, question: true },
    }),
  ]);
  const trips = board.trips;

  const today = new Date().toISOString().slice(0, 10);
  const featured = trips
    .filter((t) => t.start > today && t.avail > 0 && t.from)
    .sort((a, b) => discount(b) - discount(a) || a.start.localeCompare(b.start))
    .slice(0, 6);

  const operators = new Set(trips.map((t) => t.operator)).size;
  const ships = new Set(trips.map((t) => t.ship)).size;
  const cheapest = Math.min(...trips.map((t) => t.from ?? Number.POSITIVE_INFINITY));

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
            Expedições polares para a Antártica e o Ártico.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/90">
            Todas as saídas das principais operadoras, com datas, cabines e preços atualizados. Você escolhe a
            viagem, a nossa equipe confirma a disponibilidade e responde por email.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/datas-e-precos"
              className="rounded-md bg-accent px-7 py-4 text-lg font-semibold text-white hover:bg-accent-dark"
            >
              Ver datas e preços
            </Link>
            <Link
              href="/contato"
              className="rounded-md border-2 border-white/80 px-7 py-4 text-lg font-semibold text-white hover:bg-white/10"
            >
              Fale com a gente
            </Link>
          </div>
          {Number.isFinite(cheapest) && (
            <p className="mt-4 text-sm text-white/75">Viagens a partir de {formatUsd(cheapest)} por pessoa</p>
          )}
        </div>
      </section>

      <nav className="bg-[#063a57]">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:grid-cols-4 sm:px-6">
          {[
            ["/datas-e-precos?regiao=Antarctic", "Antártica"],
            ["/datas-e-precos?regiao=Arctic", "Ártico"],
            ["/perguntas-frequentes", "Perguntas frequentes"],
            ["/contato", "Contato"],
          ].map(([href, label]) => (
            <li key={href} className="border-white/15 py-3 text-center sm:border-l sm:first:border-l-0">
              <Link href={href} className="font-semibold text-white hover:text-[#7fd3ea]">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="bg-gradient-to-b from-[#063a57] to-primary text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-16 sm:px-6 md:grid-cols-4">
          {[
            [String(trips.length), "saídas disponíveis"],
            [String(operators), "operadoras"],
            [String(ships), "navios de expedição"],
            ["15 min", "entre uma atualização de preços e outra"],
          ].map(([value, label]) => (
            <div key={label} className="border-l border-white/25 pl-5">
              <p className="text-5xl font-extrabold">{value}</p>
              <p className="mt-1 text-sm text-white/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold text-primary">Escolha o seu polo</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {REGIONS.map((region) => {
            const list = trips.filter((t) => t.region === region.key);
            const from = Math.min(...list.map((t) => t.from ?? Number.POSITIVE_INFINITY));
            return (
              <Link
                key={region.key}
                href={`/datas-e-precos?regiao=${region.key}`}
                className="group overflow-hidden rounded-2xl border border-border bg-white"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={region.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary">{region.name}</h3>
                  <p className="mt-2 text-muted-foreground">{region.text}</p>
                  <p className="mt-4 font-semibold text-accent">
                    {list.length} saídas
                    {Number.isFinite(from) ? `, a partir de ${formatUsd(from)}` : ""} →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-surface-muted">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ofertas</p>
                <h2 className="text-3xl font-bold text-primary">Maiores descontos agora</h2>
              </div>
              <Link href="/datas-e-precos" className="font-semibold text-accent hover:underline">
                Ver todas as saídas →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((t) => (
                <Link
                  key={t.slug}
                  href={`/viagens/${t.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white"
                >
                  <div className="relative aspect-[4/3] bg-surface-muted">
                    {t.hero && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.hero} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )}
                    {discount(t) > 0 && (
                      <span className="absolute left-3 top-3 rounded bg-[#fdf3e2] px-2 py-1 text-xs font-bold text-[#8a5a00]">
                        Economize {Math.round(discount(t) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold leading-snug text-primary group-hover:text-accent">{tr(t.title)}</h3>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {formatDateRange(t.start, t.end)} · {t.days} dias
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t.operator} · {t.ship}
                    </p>
                    <p className="mt-auto pt-4">
                      {t.wasFrom && t.from && t.wasFrom > t.from && (
                        <span className="mr-2 text-sm text-muted-foreground line-through">{formatUsd(t.wasFrom)}</span>
                      )}
                      <span className="text-xl font-bold text-primary">{formatUsd(t.from)}</span>
                      <span className="text-xs text-muted-foreground"> por pessoa</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-bold text-primary">Antes de escolher</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {faqs.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/perguntas-frequentes/${f.slug}`}
                  className="block rounded-lg border border-border px-5 py-4 font-medium text-primary hover:border-accent hover:text-accent"
                >
                  {f.question}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/perguntas-frequentes" className="mt-6 inline-block font-semibold text-accent hover:underline">
            Todas as perguntas frequentes →
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 rounded-2xl bg-primary p-8 text-white md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="text-2xl font-bold">Ainda não sabe qual viagem escolher?</h2>
            <p className="mt-2 max-w-xl text-white/80">
              Conte quando quer ir, quantas pessoas viajam e o que mais quer ver. A nossa equipe responde por email
              com as opções que fazem sentido para você.
            </p>
          </div>
          <Link
            href="/contato"
            className="rounded-md bg-accent px-7 py-4 text-center font-semibold text-white hover:bg-accent-dark"
          >
            Fale com a gente
          </Link>
        </div>
      </section>
    </>
  );
}
