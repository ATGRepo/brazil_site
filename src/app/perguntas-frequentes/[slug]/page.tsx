import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllFaqSlugs, getFaq, getFaqsBySlugs } from "@/lib/faqs";

export function generateStaticParams() {
  return getAllFaqSlugs().map((slug) => ({ slug }));
}

function plainText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({
  params,
}: PageProps<"/perguntas-frequentes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const faq = getFaq(slug);
  if (!faq) return {};
  return {
    title: faq.question,
    description: plainText(faq.answer).slice(0, 160),
  };
}

// O HTML das respostas vem de content/lgp/faqs.pt.json e é validado ao carregar
// (src/lib/faqs.ts aceita só tags de texto simples e o atributo href).
export default async function FaqItemPage({
  params,
}: PageProps<"/perguntas-frequentes/[slug]">) {
  const { slug } = await params;
  const faq = getFaq(slug);

  if (!faq) notFound();

  const sources = faq.sources;
  const related = getFaqsBySlugs(faq.related);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/perguntas-frequentes" className="text-sm font-medium text-primary hover:underline">
        ← Todas as perguntas frequentes
      </Link>

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-ice-dark">
        {faq.category}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{faq.question}</h1>

      <div
        className="faq-html mt-8 border-l-2 border-ice pl-5 text-lg text-foreground"
        dangerouslySetInnerHTML={{ __html: faq.answer }}
      />

      {faq.details && (
        <div
          className="faq-html mt-8 text-foreground/90"
          dangerouslySetInnerHTML={{ __html: faq.details }}
        />
      )}

      {(sources.length > 0 || faq.checkedBy) && (
        <aside className="mt-10 rounded-xl border border-border bg-surface-muted p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-primary">
            Como sabemos disso
          </h2>
          {sources.length > 0 && (
            <>
              <p className="mt-3 text-sm text-foreground/90">
                Esta resposta vem da nossa base de conhecimento, destas entradas:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/90">
                {sources.map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </>
          )}
          {faq.checkedBy && (
            <p className="mt-3 text-sm text-muted-foreground">
              Revisado por <strong className="text-foreground">{faq.checkedBy}</strong>
              {faq.checkedOn ? `, ${faq.checkedOn}` : ""}.
            </p>
          )}
        </aside>
      )}

      {related.length > 0 && (
        <nav className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">Perguntas relacionadas</h2>
          <ul className="mt-4 space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/perguntas-frequentes/${item.slug}`}
                  className="font-medium text-primary hover:underline"
                >
                  {item.question}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-12 rounded-xl border border-border bg-surface-muted p-6 text-center">
        <p className="text-foreground">Ainda tem dúvidas?</p>
        <Link
          href="/contato"
          className="mt-3 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-dark"
        >
          Fale com nossa equipe
        </Link>
      </div>
    </div>
  );
}
