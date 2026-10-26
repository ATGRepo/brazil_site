import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShip, sameName } from "@/lib/lgp/fleet";
import { getBoard } from "@/lib/lgp/source";
import { tr, trHtml } from "@/lib/lgp/translate";
import { formatSize } from "@/lib/format";
import { TripMiniCard } from "@/components/trip-mini-card";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/navios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ship = await getShip(slug);
  return ship ? { title: ship.name, description: `${ship.name}, navio de expedição da ${ship.operator?.name ?? ""}: cabines, estrutura e próximas saídas.` } : {};
}

export default async function ShipPage({ params }: PageProps<"/navios/[slug]">) {
  const { slug } = await params;
  const [ship, board] = await Promise.all([getShip(slug), getBoard()]);
  if (!ship) notFound();
  const trips = board.trips.filter((t) => sameName(t.ship, ship.name)).sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/navios" className="text-sm font-medium text-accent hover:underline">← Todos os navios</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-xl bg-surface-muted">
          {ship.gallery[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ship.gallery[0]} alt={ship.name} className="h-full w-full object-cover" />
          )}
        </div>
        <div>
          {ship.operator && (
            <Link href={`/operadoras/${ship.operator.slug}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-accent">
              {ship.operator.name}
            </Link>
          )}
          <h1 className="mt-2 text-4xl font-bold text-primary">{ship.name}</h1>
          <dl className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {ship.type && <Fact label="Tipo" value={tr(ship.type)} />}
            {ship.capacity && <Fact label="Passageiros" value={String(ship.capacity)} />}
            {ship.year_build && <Fact label="Construído em" value={String(ship.year_build)} />}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            {trips.length > 0 && (
              <a href="#saidas" className="rounded-md bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-dark">
                Ver {trips.length} saídas
              </a>
            )}
            {ship.deckplan && (
              <a href={ship.deckplan} target="_blank" rel="noopener" className="rounded-md border-2 border-primary px-5 py-2.5 font-medium text-primary hover:bg-surface-muted">
                Plano de deques
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {ship.description && <div className="lgp-html text-[17px]" dangerouslySetInnerHTML={{ __html: trHtml(ship.description) }} />}
          {ship.practical_info && (
            <>
              <h2 className="mt-10 text-2xl font-bold text-primary">Bom saber</h2>
              <div className="lgp-html mt-3" dangerouslySetInnerHTML={{ __html: trHtml(ship.practical_info) }} />
            </>
          )}
        </div>
        {ship.facilities.length > 0 && (
          <aside className="h-fit rounded-xl border border-border bg-surface-muted p-6">
            <h2 className="text-lg font-bold text-primary">Estrutura a bordo</h2>
            <ul className="mt-3 space-y-1.5">
              {ship.facilities.map((f) => (
                <li key={f}>• {tr(f)}</li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {ship.cabins.length > 0 && (
        <section className="mt-14">
          <h2 className="text-3xl font-bold text-primary">Cabines</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {ship.cabins.map((c) => (
              <article key={c.name} className="overflow-hidden rounded-xl border border-border bg-white">
                {c.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.photo} alt={tr(c.name)} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-primary">{tr(c.name)}</h3>
                  {c.description && <div className="lgp-html mt-2 text-[15px]" dangerouslySetInnerHTML={{ __html: trHtml(c.description) }} />}
                  <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    {c.passengers ? <Fact label="Pessoas" value={String(c.passengers)} /> : null}
                    {c.size ? <Fact label="Tamanho" value={formatSize(c.size)} /> : null}
                    {c.view ? <Fact label="Vista" value={tr(c.view)} /> : null}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {trips.length > 0 && (
        <section id="saidas" className="mt-14 scroll-mt-36">
          <h2 className="text-3xl font-bold text-primary">Próximas saídas</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trips.map((t) => (
              <TripMiniCard key={t.slug} trip={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-primary">{value}</dd>
    </div>
  );
}
