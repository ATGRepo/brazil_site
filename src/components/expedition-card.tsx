import Link from "next/link";
import { formatPrice } from "@/lib/content";

type ExpeditionCardData = {
  slug: string;
  name: string;
  summary: string;
  durationDays: number;
  season: string;
  priceFrom: number | null;
  priceCurrency: string;
  destinations: { destination: { name: string } }[];
};

export function ExpeditionCard({ expedition }: { expedition: ExpeditionCardData }) {
  const price = formatPrice(expedition.priceFrom, expedition.priceCurrency);

  return (
    <Link
      href={`/expedicoes/${expedition.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary to-ice-dark text-primary-foreground">
        <span className="px-4 text-center text-sm font-medium opacity-90">
          {expedition.destinations.map((d) => d.destination.name).join(" · ")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
          {expedition.name}
        </h3>
        <p className="text-sm text-muted-foreground">{expedition.summary}</p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">
            {expedition.durationDays} dias · {expedition.season}
          </span>
          {price && <span className="font-semibold text-primary">a partir de {price}</span>}
        </div>
      </div>
    </Link>
  );
}
