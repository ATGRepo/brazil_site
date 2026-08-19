"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/destinos", label: "Destinos" },
  { href: "/expedicoes", label: "Expedições" },
  { href: "/embarcacoes", label: "Embarcações" },
  { href: "/sobre", label: "Sobre" },
  { href: "/perguntas-frequentes", label: "Perguntas Frequentes" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-lg font-semibold tracking-tight text-primary">
            Destinos Polares
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-surface-muted text-primary"
                    : "text-foreground/80 hover:bg-surface-muted hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contato"
            className="ml-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-dark"
          >
            Solicitar informações
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-primary md:hidden"
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
        <nav className="border-t border-border bg-surface px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-surface-muted hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contato"
              className="mt-1 rounded-md bg-accent px-3 py-2 text-center text-sm font-semibold text-accent-foreground"
              onClick={() => setOpen(false)}
            >
              Solicitar informações
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
