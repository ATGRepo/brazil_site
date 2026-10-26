import type { Metadata } from "next";
import Link from "next/link";
import { getBoard } from "@/lib/lgp/source";
import { PageHero, TripMiniCard } from "@/components/trip-mini-card";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Nossas viagens em grupo e fretamentos",
  description: "Viagens em grupo e navios fretados organizados pela própria Antarctica Travel Group.",
};

// Fato da base de conhecimento (kb/company-and-service/why-use-a-travel-agent.md):
// a ATG organiza as próprias viagens em grupo e fretamentos. O número de
// fretamentos não é publicado.
export default async function GroupTripsPage() {
  const board = await getBoard();
  const trips = board.trips
    .filter((t) => t.charter || t.group || t.specialty.some((s) => /^ATG /.test(s)))
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <>
      <PageHero eyebrow="Antarctica Travel Group" title="Nossas viagens em grupo e fretamentos">
        <p>
          Além de vender as viagens das operadoras, a ATG organiza as próprias viagens em grupo e fretamentos de navio.
          Nelas, a ATG é a organizadora, e a nossa equipe cuida das reservas do começo ao fim.
        </p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {trips.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((t) => (
              <TripMiniCard key={t.slug} trip={t} note={t.charter ? "Fretamento ATG" : "Viagem em grupo ATG"} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhuma viagem em grupo à venda neste momento.</p>
        )}
        <div className="mt-12 rounded-2xl bg-surface-muted p-8 text-center">
          <p className="text-lg font-semibold text-primary">Quer saber mais sobre uma viagem em grupo?</p>
          <Link href="/pedido-de-viagem" className="mt-4 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark">
            Fale com a gente
          </Link>
        </div>
      </div>
    </>
  );
}
