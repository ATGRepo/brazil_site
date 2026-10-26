import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, getShips, sameName } from "@/lib/lgp/fleet";
import { getBoard } from "@/lib/lgp/source";
import { tr } from "@/lib/lgp/translate";
import { TripMiniCard } from "@/components/trip-mini-card";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/operadoras/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);
  return company ? { title: company.name } : {};
}

export default async function CompanyPage({ params }: PageProps<"/operadoras/[slug]">) {
  const { slug } = await params;
  const [company, ships, board] = await Promise.all([getCompany(slug), getShips(), getBoard()]);
  if (!company) notFound();
  const fleet = ships.filter((s) => sameName(s.operator, company.name));
  const trips = board.trips.filter((t) => sameName(t.operator, company.name)).sort((a, b) => a.start.localeCompare(b.start));

  return (
    <>
      <section className="relative bg-primary text-white">
        {company.banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Link href="/operadoras" className="text-sm font-medium text-white/80 hover:underline">← Todas as operadoras</Link>
          <div className="mt-4 flex items-center gap-5">
            {company.logo && (
              <span className="rounded-lg bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={company.logo} alt="" className="h-14 w-auto max-w-[180px] object-contain" />
              </span>
            )}
            <h1 className="text-4xl font-extrabold">{company.name}</h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {company.description && <p className="max-w-3xl text-lg leading-relaxed text-foreground">{tr(company.description)}</p>}

        {fleet.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-primary">Navios</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {fleet.map((ship) => (
                <Link key={ship.slug} href={`/navios/${ship.slug}`} className="group overflow-hidden rounded-xl border border-border bg-white hover:border-accent">
                  <div className="aspect-[4/3] bg-surface-muted">
                    {ship.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ship.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="p-4 font-bold text-primary group-hover:text-accent">{ship.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {trips.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-primary">Próximas saídas ({trips.length})</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trips.map((t) => (
                <TripMiniCard key={t.slug} trip={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
