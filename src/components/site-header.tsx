"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";

const CONTACT_EMAIL = "contato@destinospolares.com.br";

type NavItem = { href: string; label: string; children?: { href: string; label: string }[] };

// Mesma estrutura do menu de letsgopolar.com.
const NAV: NavItem[] = [
  { href: "/", label: "Início" },
  {
    href: "/datas-e-precos",
    label: "Ver saídas",
    children: [
      { href: "/datas-e-precos", label: "Todas as datas e preços" },
      { href: "/promocoes", label: "Promoções" },
      { href: "/viagens-em-grupo", label: "Nossas viagens em grupo e fretamentos" },
      { href: "/lista-vip", label: "Entre na lista VIP de ofertas" },
    ],
  },
  {
    href: "/navios",
    label: "Navios polares",
    children: [
      { href: "/operadoras", label: "Todas as operadoras" },
      { href: "/navios", label: "Todos os navios" },
      { href: "/avaliacoes", label: "Avaliações polares" },
    ],
  },
  {
    href: "/sobre",
    label: "Sobre nós",
    children: [
      { href: "/sobre", label: "Sobre nós" },
      { href: "/sobre#equipe", label: "Conheça a equipe" },
      { href: "/sobre#somos-confiaveis", label: "Somos confiáveis?" },
      { href: "/depoimentos", label: "Depoimentos" },
    ],
  },
  { href: "/passagem-de-drake", label: "Passagem de Drake ao vivo" },
  {
    href: "/blog",
    label: "Guia de viagem polar",
    children: [
      { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
      { href: "/ciencia-cidada", label: "Programa de ciência cidadã" },
      { href: "/blog", label: "Blog: dicas e truques" },
      { href: "/o-que-levar", label: "Lista do que levar" },
      { href: "/the-drake-shake", label: "The Drake Shake" },
      { href: "/avaliacoes", label: "Avaliações polares" },
    ],
  },
  {
    href: "/contato",
    label: "Contato / Cadastro",
    children: [
      { href: "/contato#dados", label: "Dados de contato" },
      { href: "/contato#mensagem", label: "Envie uma mensagem" },
      { href: "/contato#newsletter", label: "Assine a newsletter" },
      { href: "/lista-vip", label: "Entre na lista VIP de ofertas" },
      { href: "/pedido-de-viagem", label: "Formulário de pedido de viagem" },
    ],
  },
];

function pathOf(href: string) {
  return href.split("#")[0];
}

function isActive(pathname: string, item: NavItem) {
  const paths = [item.href, ...(item.children ?? []).map((c) => c.href)].map(pathOf);
  if (item.href === "/") return pathname === "/";
  if (item.href === "/datas-e-precos" && pathname.startsWith("/viagens/")) return true;
  if (item.href === "/navios" && pathname.startsWith("/operadoras")) return true;
  return paths.some((p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)));
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);


  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="bg-primary">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-1.5 sm:justify-between sm:px-6">
          <p className="hidden text-[13px] text-white/80 sm:block">Uma marca Antarctica Travel Group</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded bg-white px-3 py-0.5 text-[13px] font-medium text-primary hover:bg-surface-muted"
          >
            ✉ {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" aria-label="Destinos Polares, página inicial" onClick={() => setOpen(false)} className="shrink-0">
            <Logo />
          </Link>

          <nav className="ml-8 hidden items-center gap-4 whitespace-nowrap xl:flex 2xl:gap-6" aria-label="Menu principal">
            {NAV.map((item, index) => {
              const active = isActive(pathname, item);
              const align = index === NAV.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2";
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-[14.5px] font-medium transition-colors ${active ? "text-accent" : "text-primary hover:text-accent"}`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-0.5 py-2 text-[14.5px] font-medium transition-colors ${
                      active ? "text-accent" : "text-primary hover:text-accent"
                    }`}
                  >
                    {item.label}
                    <Chevron className="transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className={`invisible absolute top-full z-50 w-64 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${align}`}>
                    <ul className="rounded-xl border border-border bg-white py-2 shadow-lg">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-[15px] text-primary hover:bg-surface-muted hover:text-accent"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-primary xl:hidden"
            aria-expanded={open}
            aria-label="Abrir menu de navegação"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="max-h-[75vh] overflow-y-auto border-t border-border px-4 pb-4 xl:hidden" aria-label="Menu principal">
            <ul className="pt-2">
              {NAV.map((item) =>
                item.children ? (
                  <li key={item.label}>
                    <details className="group" open={isActive(pathname, item)}>
                      <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2.5 text-[15px] font-medium text-primary hover:bg-surface-muted">
                        {item.label}
                        <Chevron className="transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="mb-1 ml-3 border-l border-border pl-3">
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-md px-3 py-2 text-[15px] text-primary hover:bg-surface-muted"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md px-3 py-2.5 text-[15px] font-medium hover:bg-surface-muted ${
                        isActive(pathname, item) ? "text-accent" : "text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
