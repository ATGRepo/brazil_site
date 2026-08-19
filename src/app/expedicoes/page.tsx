import type { Metadata } from "next";
import { getPublishedExpeditions } from "@/lib/content";
import { ExpeditionCard } from "@/components/expedition-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Expedições",
  description: "Itinerários de expedição para a Antártica, Geórgia do Sul e Ilhas Malvinas, com saída de Ushuaia.",
};

export default async function ExpedicoesPage() {
  const expeditions = await getPublishedExpeditions();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Expedições</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Itinerários de expedição marítima, com duração e destinos variados.
        Todas as saídas partem de Ushuaia, Argentina, e cruzam a Passagem de
        Drake.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {expeditions.map((expedition) => (
          <ExpeditionCard key={expedition.id} expedition={expedition} />
        ))}
      </div>
    </div>
  );
}
