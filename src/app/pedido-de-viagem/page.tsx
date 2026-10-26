import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/trip-mini-card";
import { TRIP_REQUEST_FIELDS } from "@/lib/form-fields";

export const metadata: Metadata = {
  title: "Pedido de viagem",
  description: "Conte para onde e quando quer ir, e a nossa equipe monta as opções de expedição polar para você.",
};

export default function TripRequestPage() {
  return (
    <>
      <PageHero eyebrow="Fale com a gente" title="Formulário de pedido de viagem">
        <p>
          Está meio perdido? Deixe a nossa equipe ajudar você a planejar a aventura perfeita. Preencha o formulário de
          pedido de viagem e a gente começa a procurar a expedição ideal para você.
        </p>
      </PageHero>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <LeadForm
          kind="pedido"
          fields={TRIP_REQUEST_FIELDS}
          submitLabel="Enviar pedido"
          successMessage="Recebemos, obrigado. Um especialista em viagens polares responde, normalmente em até um dia útil."
        />
      </div>
    </>
  );
}
