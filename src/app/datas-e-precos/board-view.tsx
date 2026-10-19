"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MONTHS_LONG, REGION_PT, formatDateRange, formatUsd } from "@/lib/format";

type Option = { key: string; label: string };

export type BoardRow = {
  slug: string;
  title: string;
  operator: string;
  ship: string;
  start: string;
  end: string;
  days: number;
  embark: string;
  disembark: string;
  region: string;
  month: number;
  season: number;
  places: string[];
  groups: Option[];
  specialty: Option[];
  activities: (Option & { note: string | null })[];
  from: number | null;
  wasFrom: number | null;
  avail: number;
  cabins: number;
  promotion: string | null;
  fareLabel: string | null;
  hero: string | null;
};

type Sort = "date" | "price-asc" | "price-desc" | "days";
const PAGE_SIZE = 24;

function seasonLabel(region: string, season: number) {
  return region === "Antarctic" ? `${season}/${String(season + 1).slice(2)}` : String(season);
}

// Conta quantas viagens têm cada opção, para mostrar ao lado do filtro.
function tally(rows: BoardRow[], pick: (r: BoardRow) => Option[]) {
  const map = new Map<string, Option & { count: number }>();
  for (const row of rows) {
    for (const opt of pick(row)) {
      const item = map.get(opt.key) ?? { ...opt, count: 0 };
      item.count++;
      map.set(opt.key, item);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function toggle(list: string[], key: string) {
  return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
}

export function BoardView({
  rows,
  initialRegion,
  updated,
}: {
  rows: BoardRow[];
  initialRegion: string;
  updated: string;
}) {
  const [region, setRegion] = useState(rows.some((r) => r.region === initialRegion) ? initialRegion : "");
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [operators, setOperators] = useState<string[]>([]);
  const [ships, setShips] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [tripTypes, setTripTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>("date");
  // null: abertos no computador e fechados no celular, até a pessoa clicar.
  const [filtersOpen, setFiltersOpen] = useState<boolean | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const inRegion = useMemo(() => rows.filter((r) => !region || r.region === region), [rows, region]);

  const options = useMemo(
    () => ({
      groups: tally(inRegion, (r) => r.groups),
      months: tally(inRegion, (r) => [{ key: String(r.month), label: MONTHS_LONG[r.month - 1] }]).sort(
        (a, b) => Number(a.key) - Number(b.key),
      ),
      seasons: tally(inRegion, (r) => [
        { key: `${r.region}|${r.season}`, label: `${REGION_PT[r.region] ?? r.region} ${seasonLabel(r.region, r.season)}` },
      ]).sort((a, b) => a.key.localeCompare(b.key)),
      operators: tally(inRegion, (r) => [{ key: r.operator, label: r.operator }]),
      ships: tally(inRegion, (r) => [{ key: r.ship, label: r.ship }]).sort((a, b) => a.label.localeCompare(b.label)),
      activities: tally(inRegion, (r) => r.activities),
      tripTypes: tally(inRegion, (r) => r.specialty),
    }),
    [inRegion],
  );

  const prices = inRegion.map((r) => r.from).filter((p): p is number => p != null);
  const priceCeil = prices.length ? Math.ceil(Math.max(...prices) / 1000) * 1000 : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = inRegion.filter((r) => {
      if (q) {
        const hay = [r.title, r.operator, r.ship, r.embark, r.disembark, ...r.places, ...r.groups.map((g) => g.label)]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (groups.length && !r.groups.some((g) => groups.includes(g.key))) return false;
      if (months.length && !months.includes(String(r.month))) return false;
      if (seasons.length && !seasons.includes(`${r.region}|${r.season}`)) return false;
      if (operators.length && !operators.includes(r.operator)) return false;
      if (ships.length && !ships.includes(r.ship)) return false;
      if (activities.length && !r.activities.some((a) => activities.includes(a.key))) return false;
      if (tripTypes.length && !r.specialty.some((s) => tripTypes.includes(s.key))) return false;
      if (maxPrice != null && (r.from == null || r.from > maxPrice)) return false;
      return true;
    });
    const byPrice = (r: BoardRow) => r.from ?? Number.POSITIVE_INFINITY;
    return list.sort((a, b) => {
      if (sort === "price-asc") return byPrice(a) - byPrice(b);
      if (sort === "price-desc") return (b.from ?? 0) - (a.from ?? 0);
      if (sort === "days") return a.days - b.days;
      return a.start.localeCompare(b.start);
    });
  }, [inRegion, query, groups, months, seasons, operators, ships, activities, tripTypes, maxPrice, sort]);

  const clearAll = () => {
    setQuery("");
    setGroups([]);
    setMonths([]);
    setSeasons([]);
    setOperators([]);
    setShips([]);
    setActivities([]);
    setTripTypes([]);
    setMaxPrice(null);
    setLimit(PAGE_SIZE);
  };

  const changeRegion = (value: string) => {
    setRegion(value);
    clearAll();
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[275px_1fr]">
      {filtersOpen !== false && (
        <aside
          className={`h-fit rounded-xl border border-border bg-white lg:sticky lg:top-36 ${
            filtersOpen === null ? "hidden lg:block" : ""
          }`}
        >
          <div className="space-y-3 p-3">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(PAGE_SIZE);
              }}
              placeholder="Buscar roteiro, navio, destino"
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={clearAll}
              className="w-full rounded-md border border-border py-2 text-sm text-muted-foreground hover:bg-surface-muted"
            >
              Limpar filtros
            </button>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                ["", "Os dois polos"],
                ["Antarctic", "Antártica"],
                ["Arctic", "Ártico"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeRegion(value)}
                  className={`rounded-md border px-1 py-2 text-xs font-semibold ${
                    region === value
                      ? "border-primary bg-primary text-white"
                      : "border-border text-muted-foreground hover:bg-surface-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <FilterGroup title="Destino" options={options.groups} selected={groups} onToggle={(k) => setGroups(toggle(groups, k))} open />
          <FilterGroup title="Mês de partida" options={options.months} selected={months} onToggle={(k) => setMonths(toggle(months, k))} />
          <FilterGroup title="Temporada" options={options.seasons} selected={seasons} onToggle={(k) => setSeasons(toggle(seasons, k))} />
          <FilterGroup title="Operadora" options={options.operators} selected={operators} onToggle={(k) => setOperators(toggle(operators, k))} />
          <FilterGroup title="Navio" options={options.ships} selected={ships} onToggle={(k) => setShips(toggle(ships, k))} />
          <FilterGroup title="Atividade" options={options.activities} selected={activities} onToggle={(k) => setActivities(toggle(activities, k))} />
          <FilterGroup title="Tipo de viagem" options={options.tripTypes} selected={tripTypes} onToggle={(k) => setTripTypes(toggle(tripTypes, k))} />

          {priceCeil > 0 && (
            <details className="border-t border-border px-3 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-primary">Preço</summary>
              <label className="mt-3 block text-sm text-muted-foreground">
                Até {formatUsd(maxPrice ?? priceCeil)} por pessoa
                <input
                  type="range"
                  min={1000}
                  max={priceCeil}
                  step={500}
                  value={maxPrice ?? priceCeil}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setMaxPrice(v >= priceCeil ? null : v);
                  }}
                  className="mt-2 w-full accent-[#079ec3]"
                />
              </label>
            </details>
          )}
        </aside>
      )}

      <section className={filtersOpen === false ? "lg:col-span-2" : ""}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setFiltersOpen((v) => (v === null ? window.matchMedia("(min-width: 1024px)").matches === false : !v))
              }
              className="rounded-md border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-surface-muted"
            >
              {filtersOpen === null ? (
                <>
                  <span className="lg:hidden">Mostrar filtros</span>
                  <span className="hidden lg:inline">Esconder filtros</span>
                </>
              ) : filtersOpen ? (
                "Esconder filtros"
              ) : (
                "Mostrar filtros"
              )}
            </button>
            <p className="text-sm text-muted-foreground">
              <strong className="text-lg text-primary">{filtered.length} viagens</strong> disponíveis
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Ordenar
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-md border border-border px-3 py-2 text-sm text-primary"
            >
              <option value="date">Data de partida</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="days">Duração</option>
            </select>
          </label>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Os preços são definidos pelas operadoras e mudam com a procura, às vezes de um dia para o outro.
          Valores em dólar, por pessoa. Atualizado em {updated}.
        </p>

        <div className="mt-4 space-y-4">
          {filtered.slice(0, limit).map((row) => (
            <TripCard key={row.slug} row={row} />
          ))}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-border p-8 text-center text-muted-foreground">
              Nenhuma viagem com esses filtros. Tente tirar algum filtro ou{" "}
              <Link href="/contato" className="text-accent underline">fale com a nossa equipe</Link>.
            </p>
          )}
        </div>

        {filtered.length > limit && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE_SIZE)}
              className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
            >
              Mostrar mais viagens ({filtered.length - limit})
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  open = false,
}: {
  title: string;
  options: (Option & { count: number })[];
  selected: string[];
  onToggle: (key: string) => void;
  open?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  if (options.length === 0) return null;
  const visible = showAll ? options : options.slice(0, 10);
  return (
    <details className="border-t border-border px-3 py-3" open={open || selected.length > 0}>
      <summary className="cursor-pointer text-sm font-semibold text-primary">
        {title}
        {selected.length > 0 && <span className="ml-1 text-accent">({selected.length})</span>}
      </summary>
      <ul className="mt-2 space-y-1.5">
        {visible.map((opt) => (
          <li key={opt.key}>
            <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-foreground">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.key)}
                  onChange={() => onToggle(opt.key)}
                  className="h-4 w-4 accent-[#042c43]"
                />
                {opt.label}
              </span>
              <span className="text-xs text-muted-foreground">{opt.count}</span>
            </label>
          </li>
        ))}
      </ul>
      {options.length > 10 && (
        <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-2 text-xs font-semibold text-accent">
          {showAll ? "Mostrar menos" : `Mostrar todos (${options.length})`}
        </button>
      )}
    </details>
  );
}

function TripCard({ row }: { row: BoardRow }) {
  const href = `/viagens/${row.slug}`;
  const lowAvail = row.avail > 0 && row.avail <= 2;
  return (
    <article className="grid overflow-hidden rounded-xl border border-border bg-white sm:grid-cols-[250px_1fr] xl:grid-cols-[260px_1fr_210px]">
      <Link href={href} className="relative block aspect-[4/3] bg-surface-muted sm:aspect-auto">
        {row.hero && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.hero} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          {REGION_PT[row.region] ?? row.region}
        </span>
      </Link>

      <div className="p-4 sm:p-5">
        <h2 className="text-xl font-bold leading-snug text-primary">
          <Link href={href} className="hover:text-accent">{row.title}</Link>
        </h2>
        <p className="mt-2 text-[15px] font-semibold text-primary">
          {formatDateRange(row.start, row.end)}
          <span className="font-normal text-muted-foreground"> · {row.days} dias</span>
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {row.operator} · {row.ship}
        </p>
        {row.places.length > 0 && <p className="mt-1.5 text-sm text-primary">{row.places.slice(0, 4).join(" · ")}</p>}
        <p className="mt-1.5 text-sm text-muted-foreground">
          {row.embark} → {row.embark === row.disembark ? "ida e volta" : row.disembark}
        </p>
        {row.activities.some((a) => a.note) && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {row.activities
              .filter((a) => a.note)
              .map((a) => (
                <li key={a.key} className="rounded-full border border-[#f0dfb4] bg-[#fdf8ec] px-2.5 py-0.5 text-xs text-[#8a5a00]">
                  {a.note}
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-border bg-surface-muted/60 p-4 sm:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0">
        <div>
          {row.cabins > 0 && (
            <p className={`text-xs font-semibold ${lowAvail ? "text-danger" : "text-success"}`}>
              {row.avail} de {row.cabins} tipos de cabine disponíveis
            </p>
          )}
          {row.wasFrom != null && row.from != null && row.wasFrom > row.from && (
            <p className="mt-1 text-sm text-muted-foreground line-through">{formatUsd(row.wasFrom)}</p>
          )}
          {row.from != null ? (
            <>
              <p className="text-2xl font-bold text-primary">{formatUsd(row.from)}</p>
              <p className="text-xs text-muted-foreground">a partir de, por pessoa</p>
            </>
          ) : (
            <p className="text-sm font-semibold text-primary">Preço sob consulta</p>
          )}
          {row.promotion && (
            <span className="mt-2 inline-block rounded bg-[#fdf3e2] px-2 py-0.5 text-xs font-semibold text-[#8a5a00]">
              Economize {row.promotion}
            </span>
          )}
          {row.fareLabel && <p className="mt-1 text-xs text-muted-foreground">{row.fareLabel}</p>}
        </div>
        <Link
          href={href}
          className="rounded-md bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
