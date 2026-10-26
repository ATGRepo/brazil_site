import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cabinsWithState } from "@/lib/lgp/cabins";
import { getTrip } from "@/lib/lgp/source";
import { tr, trActivity, trHtml } from "@/lib/lgp/translate";
import { REGION_PT, formatDate, formatSize, formatUsd } from "@/lib/format";
import { Gallery } from "./gallery";

export const revalidate = 900;

function plain(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function requestHref(slug: string, cabin?: string) {
  const params = new URLSearchParams({ viagem: slug });
  if (cabin) params.set("cabine", cabin);
  return `/contato?${params}`;
}

export async function generateMetadata({ params }: PageProps<"/viagens/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getTrip(slug);
  if (!detail) return {};
  const m = detail.target.meta;
  const title = tr(m.title);
  return {
    title: `${title}, ${formatDate(m.start_date)}`,
    description: `${title}: ${m.duration} dias a bordo do ${m.ship_card}, saindo de ${tr(m.embarcation)} em ${formatDate(m.start_date)}. Cabines, preços e itinerário.`,
  };
}

export default async function TripPage({ params }: PageProps<"/viagens/[slug]">) {
  const { slug } = await params;
  const detail = await getTrip(slug);
  if (!detail) notFound();

  const t = detail.target;
  const m = t.meta;
  const title = tr(m.title);
  const ship = t.ship;
  const images = [...new Set([t.featured, ...t.gallery].filter((x): x is string => !!x))];
  const activities = t.terms.filter((x) => x.taxonomy === "adventure-activities");
  const cabins = cabinsWithState(detail);
  const region = detail.feed?.region;

  const sections = [...t.itinerary];
  if (t.operator?.payment_terms && !sections.some((s) => /payment/i.test(s.title))) {
    sections.push({ title: "Payment Terms", html: t.operator.payment_terms });
  }
  const paidActivities = (detail.feed?.activities ?? []).filter((a) => a.price > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/datas-e-precos" className="hover:text-accent">Datas e preços</Link>
        {region && <span> · {REGION_PT[region] ?? region}</span>}
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <Gallery images={images} alt={title} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{m.supplier}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-primary sm:text-4xl">{title}</h1>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            <Fact label="Partida" value={formatDate(m.start_date)} />
            <Fact label="Retorno" value={formatDate(m.return_date)} />
            <Fact label="Duração" value={`${m.duration} dias`} />
            <Fact label="Embarque" value={tr(m.embarcation)} />
            <Fact label="Desembarque" value={tr(m.disembarcation)} />
            <Fact label="Navio" value={m.ship_card} />
          </dl>

          {activities.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Atividades oferecidas</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {activities.map((a) => (
                  <li key={a.slug} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-primary">
                    {tr(a.name)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.feed?.fromPrice != null && (
            <p className="mt-6 text-sm text-muted-foreground">
              A partir de{" "}
              {detail.feed.fromFull != null && detail.feed.fromFull > detail.feed.fromPrice && (
                <span className="mr-1 line-through">{formatUsd(detail.feed.fromFull)}</span>
              )}
              <strong className="text-2xl text-primary">{formatUsd(detail.feed.fromPrice)}</strong> por pessoa
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#cabines"
              className="rounded-md border-2 border-primary px-5 py-2.5 text-[15px] font-medium text-primary hover:bg-surface-muted"
            >
              Ver cabines e preços
            </a>
            <Link
              href={requestHref(slug)}
              className="rounded-md bg-accent px-5 py-2.5 text-[15px] font-medium text-white hover:bg-accent-dark"
            >
              Fale com a gente
            </Link>
          </div>
        </div>
      </div>

      {sections.length > 0 && (
        <section className="mt-14">
          <Eyebrow>Mais informações</Eyebrow>
          <h2 className="text-3xl font-bold text-primary">Detalhes da viagem</h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {sections.map((s, i) => (
              <details key={s.title + i} open={i === 0} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-4 text-lg font-medium text-primary">
                  {tr(s.title)}
                  <span className="text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <div className="lgp-html px-1 pb-6" dangerouslySetInnerHTML={{ __html: trHtml(s.html) }} />
              </details>
            ))}
          </div>
        </section>
      )}

      <section id="cabines" className="mt-14 scroll-mt-36">
        <Eyebrow>Preços por pessoa</Eyebrow>
        <h2 className="text-3xl font-bold text-primary">Cabines</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Os preços são definidos pelas operadoras e mudam com a procura, às vezes de um dia para o outro.
          Valores em dólar, por pessoa.
        </p>
        <div className="mt-6 divide-y divide-border">
          {cabins.map(({ cabin, st }, i) => (
            <article key={cabin.name + i} className="grid gap-5 py-6 sm:grid-cols-[260px_1fr_170px]">
              <div className="aspect-[6/5] overflow-hidden rounded-lg bg-surface-muted">
                {cabin.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cabin.photo} alt={tr(cabin.name)} loading="lazy" className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary">{tr(cabin.name)}</h3>
                {cabin.description && (
                  <div
                    className="lgp-html mt-2 text-[15px]"
                    dangerouslySetInnerHTML={{ __html: trHtml(cabin.description) }}
                  />
                )}
                <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3 text-[15px]">
                  {cabin.passengers ? <Fact label="Pessoas" value={String(cabin.passengers)} /> : null}
                  {cabin.size ? <Fact label="Tamanho" value={formatSize(cabin.size)} /> : null}
                  {cabin.view ? <Fact label="Vista" value={tr(cabin.view)} /> : null}
                </dl>
              </div>
              <div className="sm:text-right">
                {st.state === "priced" ? (
                  <>
                    {st.full != null && st.disc != null && st.full > st.disc && (
                      <p className="text-sm text-muted-foreground line-through">{formatUsd(st.full)}</p>
                    )}
                    <p className="text-xl font-bold text-primary">{formatUsd(st.net)}</p>
                    {i === 0 && <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Menor preço</p>}
                    <Link
                      href={requestHref(slug, cabin.name)}
                      className="mt-3 inline-block rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-dark"
                    >
                      Solicitar
                    </Link>
                  </>
                ) : st.state === "sold_out" ? (
                  <p className="font-semibold text-danger">Esgotada</p>
                ) : (
                  <>
                    <p className="font-semibold text-primary">Preço sob consulta</p>
                    <Link
                      href={requestHref(slug, cabin.name)}
                      className="mt-3 inline-block rounded-md border border-accent px-5 py-2 text-sm font-medium text-accent"
                    >
                      Consultar
                    </Link>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {(t.things_to_do.length > 0 || paidActivities.length > 0) && (
        <section className="mt-14">
          <Eyebrow>Opcionais</Eyebrow>
          <h2 className="text-3xl font-bold text-primary">Atividades de aventura</h2>
          {paidActivities.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {paidActivities.map((a) => (
                <li key={a.text} className="rounded-full border border-[#f0dfb4] bg-[#fdf8ec] px-3 py-1 text-sm text-[#8a5a00]">
                  {trActivity(a.text)}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {t.things_to_do.map((a) => (
              <article key={a.name} className="overflow-hidden rounded-xl border border-border">
                {a.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.photo} alt={tr(a.photo_alt) || tr(a.name)} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-primary">{tr(a.name)}</h3>
                  <div className="lgp-html mt-2 text-[15px]" dangerouslySetInnerHTML={{ __html: trHtml(a.html) }} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {ship && (
        <section className="mt-14">
          <Eyebrow>O navio</Eyebrow>
          <h2 className="text-3xl font-bold text-primary">{ship.name}</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              {ship.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ship.photo} alt={ship.name} loading="lazy" className="w-full rounded-xl object-cover" />
              )}
              <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
                {ship.type && <Fact label="Tipo" value={tr(ship.type)} />}
                {ship.capacity && <Fact label="Passageiros" value={String(ship.capacity)} />}
                {ship.year_build && <Fact label="Construído em" value={String(ship.year_build)} />}
              </dl>
              {ship.deckplan && (
                <a href={ship.deckplan} target="_blank" rel="noopener" className="mt-4 inline-block text-sm font-semibold text-accent underline">
                  Ver o plano de deques
                </a>
              )}
            </div>
            <div>
              {ship.description && <div className="lgp-html" dangerouslySetInnerHTML={{ __html: trHtml(ship.description) }} />}
              {ship.facilities.length > 0 && (
                <>
                  <h3 className="mt-6 text-lg font-semibold text-primary">Estrutura a bordo</h3>
                  <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {ship.facilities.map((f) => (
                      <li key={f} className="text-[15px]">• {tr(f)}</li>
                    ))}
                  </ul>
                </>
              )}
              {ship.practical_info && (
                <details className="mt-6 border-t border-border pt-4">
                  <summary className="cursor-pointer font-semibold text-primary">Bom saber</summary>
                  <div className="lgp-html mt-3" dangerouslySetInnerHTML={{ __html: trHtml(ship.practical_info) }} />
                </details>
              )}
            </div>
          </div>
        </section>
      )}

      {t.faqs.length > 0 && (
        <section className="mt-14">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <h2 className="text-3xl font-bold text-primary">Dúvidas sobre esta viagem</h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {t.faqs.map((f, i) => (
              <details key={f.q + i} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 font-medium text-primary">
                  {tr(f.q)}
                  <span className="text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <div className="lgp-html px-1 pb-5" dangerouslySetInnerHTML={{ __html: trHtml(f.a) }} />
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 rounded-2xl bg-primary px-6 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Quer reservar ou tirar uma dúvida?</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/80">
          Fale com a nossa equipe. A gente confirma a disponibilidade com a operadora e responde por email.
        </p>
        <Link
          href={requestHref(slug)}
          className="mt-5 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark"
        >
          Pedir informações desta viagem
        </Link>
        <p className="mt-3 text-xs text-white/60">{plain(title)} · {formatDate(m.start_date)}</p>
      </section>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{children}</p>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold text-primary">{value}</dd>
    </div>
  );
}
