import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedFaqItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description: "Dúvidas comuns sobre expedições à Antártica: melhor época, documentação, vida a bordo e reservas.",
};

export default async function FaqPage() {
  const groups = await getPublishedFaqItems();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        Perguntas Frequentes
      </h1>
      <p className="mt-3 text-muted-foreground">
        Reunimos as dúvidas mais comuns de quem está planejando uma
        expedição polar. Se sua dúvida não estiver aqui, entre em contato
        com nossa equipe por email.
      </p>

      <div className="mt-10 space-y-10">
        {groups.map((group) => (
          <div key={group.category}>
            <h2 className="text-xl font-semibold text-primary">{group.category}</h2>
            <div className="mt-4 space-y-4">
              {group.questions.map((item) => (
                <details
                  key={item.id}
                  className="group rounded-lg border border-border bg-surface p-4 open:bg-surface"
                >
                  <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}
                      <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  {item.answer.trimStart().startsWith("<") ? (
                    <div
                      className="faq-html mt-3 text-sm text-foreground/90"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  ) : (
                    <p className="mt-3 text-sm text-foreground/90">{item.answer}</p>
                  )}
                  {item.slug && (
                    <Link
                      href={`/perguntas-frequentes/${item.slug}`}
                      className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      Ler a resposta completa →
                    </Link>
                  )}
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

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
