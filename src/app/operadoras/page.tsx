import type { Metadata } from "next";
import Link from "next/link";
import { getCompanies } from "@/lib/lgp/fleet";
import { PageHero } from "@/components/trip-mini-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Todas as operadoras",
  description: "As operadoras de expedições polares com que trabalhamos.",
};

export default async function CompaniesPage() {
  const companies = await getCompanies();
  return (
    <>
      <PageHero eyebrow="Navios polares" title="Todas as operadoras">
        <p>As operadoras de expedição com que trabalhamos. Escolha uma para ver os navios e as próximas saídas.</p>
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {companies.map((c) => (
          <Link key={c.slug} href={`/operadoras/${c.slug}`} className="group flex flex-col items-center rounded-xl border border-border bg-white p-6 text-center hover:border-accent">
            <div className="flex h-24 w-full items-center justify-center">
              {c.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.logo} alt="" loading="lazy" className="max-h-20 max-w-[80%] object-contain" />
              )}
            </div>
            <h2 className="mt-4 font-bold text-primary group-hover:text-accent">{c.name}</h2>
          </Link>
        ))}
      </div>
    </>
  );
}
