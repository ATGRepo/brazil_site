import type { Metadata } from "next";
import Link from "next/link";
import { getTrip } from "@/lib/lgp/source";
import { tr } from "@/lib/lgp/translate";
import { formatDate } from "@/lib/format";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/trip-mini-card";
import { ContactForm } from "./contact-form";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contato@destinospolares.com.br";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com quem já esteve lá. Uma pessoa de verdade responde, normalmente em até um dia útil.",
};

export default async function ContatoPage({ searchParams }: PageProps<"/contato">) {
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
    <>
      <PageHero eyebrow="Contato" title="Fale com quem já esteve lá.">
        <p>Uma pessoa de verdade responde, normalmente em até um dia útil.</p>
        <nav className="mt-6 flex flex-wrap gap-3 text-base">
          <a href="#mensagem" className="rounded-md bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark">
            Envie uma mensagem
          </a>
          <a href="#newsletter" className="rounded-md border-2 border-white/80 px-5 py-3 font-semibold hover:bg-white/10">
            Assine a newsletter
          </a>
          <Link href="/lista-vip" className="rounded-md border-2 border-white/80 px-5 py-3 font-semibold hover:bg-white/10">
            Entre na lista VIP
          </Link>
        </nav>
      </PageHero>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <section id="mensagem" className="scroll-mt-36">
          <h2 className="text-2xl font-bold text-primary">Envie uma mensagem</h2>
          <p className="mt-2 text-muted-foreground">
            Conte para onde quer ir, quando e quem vai junto. Um especialista responde com opções e preços de verdade.
          </p>
          {tripLabel && (
            <div className="mt-6 rounded-xl border border-border bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Você está perguntando sobre</p>
              <p className="mt-1 font-semibold text-primary">{tripLabel}</p>
            </div>
          )}
          <div className="mt-6">
            <ContactForm tripLabel={tripLabel} tripSlug={trip ? slug : undefined} />
          </div>
        </section>

        <div className="space-y-12">
          <section id="newsletter" className="scroll-mt-36 rounded-2xl bg-primary p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">A newsletter</p>
            <h2 className="mt-2 text-2xl font-bold">Fique sabendo das viagens polares antes de todo mundo.</h2>
            <p className="mt-2 text-white/80">Promoções polares, posts novos do blog e próximas saídas, no seu email.</p>
            <div className="mt-6">
              <LeadForm
                kind="newsletter"
                dark
                fields={[
                  { type: "text", label: "Nome", required: true },
                  { type: "email", label: "Email", required: true },
                  {
                    type: "checkbox",
                    label: "Quero que alguém da equipe me ajude a planejar a viagem",
                  },
                ]}
                submitLabel="Assinar"
                successMessage="Pronto, você vai receber a nossa newsletter."
              />
            </div>
          </section>

          <section id="dados" className="scroll-mt-36">
            <h2 className="text-2xl font-bold text-primary">Dados de contato</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-accent hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Pedido de viagem</dt>
                <dd>
                  <Link href="/pedido-de-viagem" className="font-semibold text-accent hover:underline">
                    Preencha o formulário de pedido de viagem
                  </Link>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
