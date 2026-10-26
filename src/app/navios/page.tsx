import type { Metadata } from "next";
import Link from "next/link";
import { getShips } from "@/lib/lgp/fleet";
import { tr } from "@/lib/lgp/translate";
import { PageHero } from "@/components/trip-mini-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Todos os navios",
  description: "Os navios de expedição que levam viajantes à Antártica e ao Ártico, por operadora.",
};

export default async function ShipsPage() {
  const ships = await getShips();
  const byOperator = new Map<string, typeof ships>();
  for (const ship of ships) byOperator.set(ship.operator, [...(byOperator.get(ship.operator) ?? []), ship]);
  const operators = [...byOperator.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageHero eyebrow="Navios polares" title="Todos os navios">
        <p>{ships.length} navios de expedição, de {operators.length} operadoras. Escolha um para ver cabines, estrutura a bordo e próximas saídas.</p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {operators.map((op) => (
          <section key={op} className="mt-10 first:mt-0">
            <h2 className="text-2xl font-bold text-primary">{op}</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {byOperator.get(op)!.map((ship) => (
                <Link key={ship.slug} href={`/navios/${ship.slug}`} className="group overflow-hidden rounded-xl border border-border bg-white hover:border-accent">
                  <div className="aspect-[4/3] bg-surface-muted">
                    {ship.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ship.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-primary group-hover:text-accent">{ship.name}</h3>
                    {ship.type && <p className="text-sm text-muted-foreground">{tr(ship.type)}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
