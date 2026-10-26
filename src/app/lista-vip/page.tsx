import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { PageHero, TripMiniCard, discountOf } from "@/components/trip-mini-card";
import { getBoard } from "@/lib/lgp/source";
import { SEASONS } from "@/lib/form-fields";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Lista VIP de ofertas",
  description: "Receba as ofertas de expedições polares antes de todo mundo.",
};

export default async function VipPage() {
  const board = await getBoard();
  const today = new Date().toISOString().slice(0, 10);
  const discounted = board.trips.filter((t) => t.start > today && t.avail > 0 && discountOf(t) > 0);
  const top = [...discounted].sort((a, b) => discountOf(b) - discountOf(a)).slice(0, 4);

  return (
    <>
      <PageHero eyebrow="Lista de acesso antecipado" title="Entre na lista VIP">
        <p>
          Fique sabendo das ofertas antes de elas entrarem no nosso resumo semanal de ofertas ou serem publicadas no grupo
          do Facebook. A gente envia assim que recebe.
        </p>
        <p className="mt-3">
          Essas ofertas costumam ter disponibilidade bem limitada, então vale saber delas cedo e agir rápido.
        </p>
      </PageHero>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <LeadForm
          kind="vip"
          fields={[
            { type: "text", label: "Nome", required: true },
            { type: "text", label: "Sobrenome", required: true },
            { type: "email", label: "Email", required: true, half: false },
            { type: "checkboxes", label: "Quando você pensa em ir? Marque as que servem", options: SEASONS },
          ]}
          submitLabel="Quero ser VIP"
          successMessage="Pronto, você está na lista VIP. As próximas ofertas chegam no seu email."
        />
      </div>

      {top.length > 0 && (
        <section className="bg-surface-muted">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <h2 className="text-2xl font-bold text-primary">Em promoção agora</h2>
            <p className="mt-1 text-muted-foreground">
              {discounted.length} saídas estão com desconto hoje. Estes são os maiores descontos.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {top.map((t) => (
                <TripMiniCard key={t.slug} trip={t} />
              ))}
            </div>
            <Link href="/promocoes" className="mt-6 inline-block font-semibold text-accent hover:underline">
              Ver todas as promoções →
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-primary">Quer que a gente encontre a viagem, e não só a oferta?</h2>
        <p className="mt-3 text-muted-foreground">
          Diga mais ou menos para onde e quando quer ir, e um especialista em viagens polares monta uma lista curta para
          você. Leva uns dois minutos, e não há compromisso no final.
        </p>
        <Link href="/pedido-de-viagem" className="mt-5 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark">
          Preencher o pedido de viagem
        </Link>
      </section>
    </>
  );
}
