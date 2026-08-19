import Link from "next/link";
import { getFeaturedExpeditions, getPublishedDestinations } from "@/lib/content";
import { ExpeditionCard } from "@/components/expedition-card";
import { DestinationCard } from "@/components/destination-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [expeditions, destinations] = await Promise.all([
    getFeaturedExpeditions(),
    getPublishedDestinations(),
  ]);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-ice">
            Expedições polares
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Conheça a Antártica, a Geórgia do Sul e as Ilhas Malvinas
          </h1>
          <p className="mt-6 max-w-xl text-lg text-primary-foreground/85">
            Expedições marítimas para viajantes que buscam paisagens remotas,
            vida selvagem em abundância e a experiência de cruzar a Passagem
            de Drake rumo ao continente branco.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/expedicoes"
              className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-dark"
            >
              Ver expedições
            </Link>
            <Link
              href="/contato"
              className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Solicitar informações
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Expedições em destaque
            </h2>
            <p className="mt-2 text-muted-foreground">
              Itinerários selecionados, com saída de Ushuaia, Argentina.
            </p>
          </div>
          <Link href="/expedicoes" className="hidden shrink-0 text-sm font-semibold text-primary hover:underline sm:block">
            Ver todas →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {expeditions.map((expedition) => (
            <ExpeditionCard key={expedition.id} expedition={expedition} />
          ))}
        </div>
      </section>

      <section className="bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Destinos
          </h2>
          <p className="mt-2 text-muted-foreground">
            Cada expedição combina um ou mais destinos, conforme o roteiro e as condições de gelo.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Pronto para planejar sua expedição?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Nossa equipe responde por email com disponibilidade, valores e
            condições para o itinerário escolhido. Não realizamos venda
            online: toda solicitação é atendida de forma personalizada.
          </p>
          <div className="mt-6">
            <Link
              href="/contato"
              className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-dark"
            >
              Fale com nossa equipe
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
