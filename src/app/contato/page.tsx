import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Solicite informações sobre expedições à Antártica. Todo o atendimento é feito por email, sem venda online.",
};

export default async function ContatoPage({
  searchParams,
}: PageProps<"/contato">) {
  const params = await searchParams;
  const expedicaoSlug = typeof params.expedicao === "string" ? params.expedicao : undefined;

  const [expeditions, defaultExpedition] = await Promise.all([
    prisma.expedition.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
    expedicaoSlug
      ? prisma.expedition.findUnique({
          where: { slug: expedicaoSlug },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Contato</h1>
      <p className="mt-3 text-muted-foreground">
        Preencha o formulário abaixo com o que você procura. Não realizamos
        venda ou reserva online: nossa equipe responde por email com
        disponibilidade, valores e próximos passos.
      </p>

      <div className="mt-8">
        <ContactForm
          expeditions={expeditions}
          defaultExpeditionId={defaultExpedition?.id}
        />
      </div>
    </div>
  );
}
