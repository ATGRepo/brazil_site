import type { Metadata } from "next";
import { getBoard } from "@/lib/lgp/source";
import { tr, trActivity } from "@/lib/lgp/translate";
import { formatFeedDate } from "@/lib/format";
import { BoardView, type BoardRow } from "./board-view";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Datas e preços",
  description:
    "Todas as saídas de expedições à Antártica e ao Ártico, com datas, cabines disponíveis e preços por pessoa.",
};

export default async function DatesAndRatesPage({
  searchParams,
}: PageProps<"/datas-e-precos">) {
  const board = await getBoard();
  const params = await searchParams;
  const region = typeof params.regiao === "string" ? params.regiao : "";

  const rows: BoardRow[] = board.trips.map((t) => ({
    slug: t.slug,
    title: tr(t.title),
    operator: t.operator,
    ship: t.ship,
    start: t.start,
    end: t.end,
    days: t.days,
    embark: tr(t.embark),
    disembark: tr(t.disembark),
    region: t.region,
    month: t.month,
    season: Number(t.start.slice(0, 4)) - (t.region === "Antarctic" && t.month < 7 ? 1 : 0),
    places: t.dest.filter((d) => !/^(Antarctica|Arctic|Other)$/.test(d)).map(tr),
    groups: [...new Set(t.fdest)].map((d) => ({ key: d, label: tr(d) })),
    specialty: t.specialty.map((s) => ({ key: s, label: tr(s) })),
    activities: t.activityTags.map((a) => ({
      key: a,
      label: tr(a),
      note: t.activityNotes?.[a] ? trActivity(t.activityNotes[a]) : null,
    })),
    from: t.from,
    wasFrom: t.wasFrom,
    avail: t.avail,
    cabins: t.cabins,
    promotion: t.promotion_text,
    fareLabel: t.fareLabel ? tr(t.fareLabel) : null,
    hero: t.hero,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-primary sm:text-4xl">Datas e preços</h1>
      <BoardView rows={rows} initialRegion={region} updated={formatFeedDate(board.feed_updated)} />
    </div>
  );
}
