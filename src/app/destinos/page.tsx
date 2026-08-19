import type { Metadata } from "next";
import { getPublishedDestinations } from "@/lib/content";
import { DestinationCard } from "@/components/destination-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Destinos",
  description: "Conheça os destinos das nossas expedições polares: Antártica, Geórgia do Sul e Ilhas Malvinas.",
};

export default async function DestinosPage() {
  const destinations = await getPublishedDestinations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Destinos</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Cada região tem características próprias de paisagem e vida
        selvagem. Nossas expedições combinam um ou mais destinos, conforme
        o itinerário e as condições de gelo no período da viagem.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}
