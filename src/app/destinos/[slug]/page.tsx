import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDestinationBySlug, parseJsonArray } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/destinos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};
  return {
    title: destination.name,
    description: destination.summary,
  };
}

export default async function DestinationPage({
  params,
}: PageProps<"/destinos/[slug]">) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) notFound();

  const highlights = parseJsonArray(destination.highlights);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link href="/destinos" className="text-sm font-medium text-primary hover:underline">
        ← Todos os destinos
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
        {destination.name}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{destination.summary}</p>

      <div className="mt-8 whitespace-pre-line text-foreground/90">
        {destination.description}
      </div>

      {highlights.length > 0 && (
        <div className="mt-10 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">Destaques</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2 text-sm text-foreground/90">
                <span className="text-ice-dark">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {destination.expeditions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Expedições que visitam este destino
          </h2>
          <ul className="mt-4 space-y-2">
            {destination.expeditions.map(({ expedition }) => (
              <li key={expedition.id}>
                <Link
                  href={`/expedicoes/${expedition.slug}`}
                  className="font-medium text-primary hover:underline"
                >
                  {expedition.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-border bg-surface-muted p-6 text-center">
        <p className="text-foreground">
          Quer saber mais sobre viagens para {destination.name}?
        </p>
        <Link
          href="/contato"
          className="mt-3 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-dark"
        >
          Solicitar informações
        </Link>
      </div>
    </div>
  );
}
