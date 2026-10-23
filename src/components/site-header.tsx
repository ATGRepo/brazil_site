"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";

const CONTACT_EMAIL = "contato@destinospolares.com.br";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/datas-e-precos", label: "Datas e preços" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/contato", label: "Contato" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/datas-e-precos") return pathname.startsWith(href) || pathname.startsWith("/viagens");
  return pathname.startsWith(href);
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
          <Link href="/" aria-label="Destinos Polares, página inicial" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium transition-colors ${
                  isActive(pathname, link.href) ? "text-accent" : "text-primary hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-primary lg:hidden"
            aria-expanded={open}
            aria-label="Abrir menu de navegação"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="border-t border-border px-4 pb-4 lg:hidden">
            <div className="flex flex-col gap-1 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-[15px] font-medium hover:bg-surface-muted ${
                    isActive(pathname, link.href) ? "text-accent" : "text-primary"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
