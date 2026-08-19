import Link from "next/link";

type DestinationCardData = {
  slug: string;
  name: string;
  summary: string;
};

export function DestinationCard({ destination }: { destination: DestinationCardData }) {
  return (
    <Link
      href={`/destinos/${destination.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-28 items-center justify-center bg-ice/20">
        <span className="text-3xl">🧊</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
          {destination.name}
        </h3>
        <p className="text-sm text-muted-foreground">{destination.summary}</p>
      </div>
    </Link>
  );
}
