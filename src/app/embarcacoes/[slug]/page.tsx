import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVesselBySlug, parseJsonArray } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/embarcacoes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vessel = await getVesselBySlug(slug);
  if (!vessel) return {};
  return {
    title: vessel.name,
    description: vessel.summary,
  };
}

export default async function VesselPage({
  params,
}: PageProps<"/embarcacoes/[slug]">) {
  const { slug } = await params;
  const vessel = await getVesselBySlug(slug);

  if (!vessel) notFound();

  const amenities = parseJsonArray(vessel.amenities);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link href="/embarcacoes" className="text-sm font-medium text-primary hover:underline">
        ← Todas as embarcações
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
        {vessel.name}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{vessel.summary}</p>

      {vessel.capacity && (
        <p className="mt-4 inline-block rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-foreground">
          Capacidade: até {vessel.capacity} passageiros
        </p>
      )}

      <div className="mt-8 whitespace-pre-line text-foreground/90">
        {vessel.description}
      </div>

      {amenities.length > 0 && (
        <div className="mt-10 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">Comodidades e estrutura</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {amenities.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-foreground/90">
                <span className="text-ice-dark">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {vessel.expeditions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Expedições com esta embarcação
          </h2>
          <ul className="mt-4 space-y-2">
            {vessel.expeditions.map((expedition) => (
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
        <p className="text-foreground">Quer saber mais sobre esta embarcação?</p>
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
