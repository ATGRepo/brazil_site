import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedVessels } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Embarcações",
  description: "Conheça as embarcações de expedição utilizadas em nossas viagens polares.",
};

export default async function VesselsPage() {
  const vessels = await getPublishedVessels();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Embarcações</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Navios de expedição com casco reforçado para navegação polar,
        equipados para desembarques em Zodiac e acompanhados por equipe de
        expedição especializada.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {vessels.map((vessel) => (
          <Link
            key={vessel.id}
            href={`/embarcacoes/${vessel.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-ice-dark to-primary text-primary-foreground">
              <span className="text-3xl">🚢</span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h2 className="text-lg font-semibold text-foreground group-hover:text-primary">
                {vessel.name}
              </h2>
              <p className="text-sm text-muted-foreground">{vessel.summary}</p>
              {vessel.capacity && (
                <p className="mt-auto text-sm font-medium text-primary">
                  Até {vessel.capacity} passageiros
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
