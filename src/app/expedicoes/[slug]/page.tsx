import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getExpeditionBySlug,
  parseItinerary,
  parseJsonArray,
  formatPrice,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/expedicoes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const expedition = await getExpeditionBySlug(slug);
  if (!expedition) return {};
  return {
    title: expedition.name,
    description: expedition.summary,
  };
}

export default async function ExpeditionPage({
  params,
}: PageProps<"/expedicoes/[slug]">) {
  const { slug } = await params;
  const expedition = await getExpeditionBySlug(slug);

  if (!expedition) notFound();

  const itinerary = parseItinerary(expedition.itinerary);
  const included = parseJsonArray(expedition.included);
  const excluded = parseJsonArray(expedition.excluded);
  const price = formatPrice(expedition.priceFrom, expedition.priceCurrency);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link href="/expedicoes" className="text-sm font-medium text-primary hover:underline">
        ← Todas as expedições
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
        {expedition.name}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{expedition.summary}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface p-6 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">Duração</dt>
          <dd className="mt-1 font-semibold text-foreground">{expedition.durationDays} dias</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Temporada</dt>
          <dd className="mt-1 font-semibold text-foreground">{expedition.season}</dd>
        </div>
        {expedition.startingFrom && (
          <div>
            <dt className="text-muted-foreground">Saída</dt>
            <dd className="mt-1 font-semibold text-foreground">{expedition.startingFrom}</dd>
          </div>
        )}
        {price && (
          <div>
            <dt className="text-muted-foreground">A partir de</dt>
            <dd className="mt-1 font-semibold text-primary">{price}</dd>
          </div>
        )}
      </dl>

      <div className="mt-8 whitespace-pre-line text-foreground/90">
        {expedition.description}
      </div>

      {expedition.vessel && (
        <div className="mt-8 rounded-xl border border-border bg-surface-muted p-6">
          <p className="text-sm text-muted-foreground">Embarcação</p>
          <Link
            href={`/embarcacoes/${expedition.vessel.slug}`}
            className="mt-1 block text-lg font-semibold text-primary hover:underline"
          >
            {expedition.vessel.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{expedition.vessel.summary}</p>
        </div>
      )}

      {expedition.destinations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Destinos visitados</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {expedition.destinations.map(({ destination }) => (
              <Link
                key={destination.id}
                href={`/destinos/${destination.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
              >
                {destination.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {itinerary.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">Roteiro</h2>
          <ol className="mt-4 space-y-4 border-l-2 border-ice pl-6">
            {itinerary.map((item) => (
              <li key={item.day}>
                <p className="text-sm font-semibold text-primary">Dia {item.day}</p>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {(included.length > 0 || excluded.length > 0) && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {included.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">O que está incluído</h2>
              <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                {included.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-ice-dark">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {excluded.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="font-semibold text-foreground">O que não está incluído</h2>
              <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                {excluded.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-muted-foreground">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 rounded-xl border border-border bg-surface-muted p-6 text-center">
        <p className="text-foreground">
          Quer solicitar informações sobre esta expedição?
        </p>
        <Link
          href={{ pathname: "/contato", query: { expedicao: expedition.slug } }}
          className="mt-3 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-dark"
        >
          Solicitar informações
        </Link>
      </div>
    </div>
  );
}
