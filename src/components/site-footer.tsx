import Link from "next/link";
import { Logo } from "@/components/logo";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contato@destinospolares.com.br";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="inline-block rounded-lg bg-white px-3 py-2">
            <Logo />
          </span>
          <p className="mt-4 text-sm font-semibold text-white">Uma marca Antarctica Travel Group</p>
          <p className="mt-2 max-w-sm text-sm text-white/75">
            Expedições polares à Antártica e ao Ártico, com datas, cabines e preços atualizados
            pelas operadoras.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Explorar</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/datas-e-precos" className="hover:underline">Datas e preços</Link></li>
            <li><Link href="/promocoes" className="hover:underline">Promoções</Link></li>
            <li><Link href="/navios" className="hover:underline">Navios</Link></li>
            <li><Link href="/operadoras" className="hover:underline">Operadoras</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
            <li><Link href="/perguntas-frequentes" className="hover:underline">Perguntas frequentes</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Atendimento</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/sobre" className="hover:underline">Sobre nós</Link></li>
            <li><Link href="/contato" className="hover:underline">Contato</Link></li>
            <li><Link href="/pedido-de-viagem" className="hover:underline">Pedido de viagem</Link></li>
            <li><Link href="/lista-vip" className="hover:underline">Lista VIP de ofertas</Link></li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="mx-auto max-w-7xl px-4 text-xs text-white/55 sm:px-6">
          © {year} Destinos Polares, uma marca Antarctica Travel Group. Preços definidos pelas operadoras, sujeitos a alteração sem aviso.
        </p>
      </div>
    </footer>
  );
}
