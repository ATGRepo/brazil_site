import Link from "next/link";
import type { BoardTrip } from "@/lib/lgp/source";
import { tr } from "@/lib/lgp/translate";
import { REGION_PT, formatDateRange, formatUsd } from "@/lib/format";

export function discountOf(t: BoardTrip) {
  return t.from && t.wasFrom && t.wasFrom > t.from ? 1 - t.from / t.wasFrom : 0;
}

export function TripMiniCard({ trip, note }: { trip: BoardTrip; note?: string }) {
  const off = discountOf(trip);
  return (
    <Link
      href={`/viagens/${trip.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white hover:border-accent"
    >
      <div className="relative aspect-[4/3] bg-surface-muted">
        {trip.hero && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={trip.hero} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          {REGION_PT[trip.region] ?? trip.region}
        </span>
        {off >= 0.01 && (
          <span className="absolute right-3 top-3 rounded bg-[#fdf3e2] px-2 py-1 text-xs font-bold text-[#8a5a00]">
            {Math.round(off * 100)}% off
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {note && <p className="text-xs font-semibold uppercase tracking-wide text-accent">{note}</p>}
        <h3 className="mt-1 text-lg font-bold leading-snug text-primary group-hover:text-accent">{tr(trip.title)}</h3>
        <p className="mt-2 text-sm font-semibold text-primary">
          {formatDateRange(trip.start, trip.end)} · {trip.days} dias
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {trip.operator} · {trip.ship} · saindo de {tr(trip.embark)}
        </p>
        <p className="mt-auto pt-4">
          {trip.wasFrom != null && trip.from != null && trip.wasFrom > trip.from && (
            <span className="mr-2 text-sm text-muted-foreground line-through">{formatUsd(trip.wasFrom)}</span>
          )}
          <span className="text-xl font-bold text-primary">{formatUsd(trip.from) ?? "Sob consulta"}</span>
          {trip.from != null && <span className="text-xs text-muted-foreground"> por pessoa</span>}
        </p>
      </div>
    </Link>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg text-white/85">{children}</div>}
      </div>
    </section>
  );
}
