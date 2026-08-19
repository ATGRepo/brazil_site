import Link from "next/link";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contato@destinospolares.com.br";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold">Destinos Polares</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Expedições à Antártica, Geórgia do Sul e Ilhas Malvinas.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Explorar
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/destinos" className="hover:underline">Destinos</Link></li>
            <li><Link href="/expedicoes" className="hover:underline">Expedições</Link></li>
            <li><Link href="/embarcacoes" className="hover:underline">Embarcações</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Sobre
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/sobre" className="hover:underline">Quem somos</Link></li>
            <li><Link href="/perguntas-frequentes" className="hover:underline">Perguntas Frequentes</Link></li>
            <li><Link href="/contato" className="hover:underline">Contato</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Atendimento
          </p>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Todo o atendimento e as solicitações de viagem são feitos por email.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-2 inline-block text-sm font-medium underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="mx-auto max-w-6xl px-4 text-xs text-primary-foreground/60 sm:px-6">
          © {year} Destinos Polares. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
