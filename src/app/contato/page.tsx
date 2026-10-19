import type { Metadata } from "next";
import { getTrip } from "@/lib/lgp/source";
import { tr } from "@/lib/lgp/translate";
import { formatDate } from "@/lib/format";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Peça informações sobre expedições à Antártica e ao Ártico. A nossa equipe responde por email com disponibilidade, valores e próximos passos.",
};

export default async function ContatoPage({
  searchParams,
}: PageProps<"/contato">) {
  const params = await searchParams;
  const slug = typeof params.viagem === "string" ? params.viagem : undefined;
  const cabin = typeof params.cabine === "string" ? params.cabine.slice(0, 120) : undefined;
  const trip = slug ? await getTrip(slug) : null;

  const tripLabel = trip
    ? [
        tr(trip.target.meta.title),
        formatDate(trip.target.meta.start_date),
        trip.target.meta.ship_card,
        trip.target.meta.supplier,
        cabin ? `cabine ${tr(cabin)}` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-primary sm:text-4xl">Contato</h1>
      <p className="mt-3 text-muted-foreground">
        Conte o que você procura. Não fazemos venda ou reserva online: a nossa equipe confirma a
        disponibilidade com a operadora e responde por email com valores e próximos passos.
      </p>

      {tripLabel && (
        <div className="mt-6 rounded-xl border border-border bg-surface-muted p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Viagem escolhida</p>
          <p className="mt-1 font-semibold text-primary">{tripLabel}</p>
        </div>
      )}

      <div className="mt-8">
        <ContactForm tripLabel={tripLabel} tripSlug={trip ? slug : undefined} />
      </div>
    </div>
  );
}
