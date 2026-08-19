import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a Destinos Polares e nossa forma de organizar expedições à Antártica.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Sobre a Destinos Polares</h1>

      <div className="mt-8 space-y-6 text-foreground/90">
        <p>
          A Destinos Polares organiza expedições marítimas para viajantes
          brasileiros que buscam conhecer a Antártica, a Geórgia do Sul e as
          Ilhas Malvinas. Trabalhamos com embarcações de expedição
          especializadas em navegação polar, sempre acompanhadas por equipes
          de guias naturalistas.
        </p>
        <p>
          Cada solicitação é atendida de forma personalizada, por email, por
          nossa equipe de consultores especializados em viagens polares. Não
          trabalhamos com venda ou reserva online: entendemos que uma viagem
          a um dos destinos mais remotos do planeta exige atendimento
          próximo, com espaço para tirar dúvidas sobre itinerário,
          equipamentos, saúde e logística antes da confirmação.
        </p>
        <p>
          Nosso papel é ajudar o viajante a escolher o itinerário mais
          adequado ao seu perfil e disponibilidade, seja uma expedição
          clássica de dez dias à Península Antártica, seja uma viagem mais
          longa que reúne a Geórgia do Sul e as Ilhas Malvinas.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-border bg-surface-muted p-6 text-center">
        <p className="text-foreground">
          Tem dúvidas sobre como funciona uma expedição polar?
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <Link
            href="/perguntas-frequentes"
            className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
          >
            Ver perguntas frequentes
          </Link>
          <Link
            href="/contato"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-dark"
          >
            Falar com nossa equipe
          </Link>
        </div>
      </div>
    </div>
  );
}
