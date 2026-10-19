// Liga as cabines descritas na viagem (target.cabins) às cabines com preço do
// feed (feed.cabins). Os nomes nem sempre batem, então seguimos exatamente as
// regras da página de viagem do letsgopolar.com (cabinState em all-trips),
// que por sua vez seguem as do desk.

import type { FeedCabin, TripCabin, TripDetail } from "./source";

function onlyAlnum(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function nship(s: string) {
  let v = (s || "").toLowerCase();
  for (const w of ["m/v ", "m/s ", "mv ", "ms ", "ss ", "sh ", "the "]) v = v.split(w).join("");
  return onlyAlnum(v);
}

function stripSuffixes(s: string) {
  let v = (s || "").toLowerCase().split("—")[0];
  for (const d of ["(single)", "(double)", "(triple)", "(quad)", "(solo)"]) v = v.split(d).join("");
  return v;
}

function ncabLegacy(s: string) {
  return onlyAlnum(stripSuffixes(s));
}

function ncab(s: string) {
  let v = stripSuffixes(s).split("’s ").join(" ").split("'s ").join(" ");
  v = onlyAlnum(v);
  if (v.length > 6 && v.endsWith("cabins")) v = v.slice(0, -6);
  else if (v.length > 5 && v.endsWith("cabin")) v = v.slice(0, -5);
  if (v.length > 4 && v.endsWith("solo")) v = v.slice(0, -4) + "single";
  if (v.length > 6 && v.endsWith("ssuite")) v = v.slice(0, -6) + "suite";
  return v;
}

export type CabinState =
  | { state: "priced"; full: number | null; disc: number | null; net: number }
  | { state: "on_request" | "sold_out" | "retired" };

const ORDER = { priced: 0, on_request: 1, sold_out: 2, retired: 3 } as const;

export function cabinsWithState(detail: TripDetail) {
  const feed = detail.feed;
  const byNorm: Record<string, FeedCabin> = {};
  const vocab = new Set<string>();
  for (const c of feed?.cabins ?? []) {
    byNorm[ncab(c.name)] = c;
    const legacy = ncabLegacy(c.name);
    if (!(legacy in byNorm)) byNorm[legacy] = c;
  }
  for (const n of detail.ship_vocab ?? []) {
    if (ncab(n)) vocab.add(ncab(n));
    if (ncabLegacy(n)) vocab.add(ncabLegacy(n));
  }
  const alias = detail.alias ?? {};
  const prefix = `${(feed?.operator ?? "").toLowerCase()}|${nship(feed?.ship ?? "")}|`;
  const missingPolicy = detail.target.operator?.missing_cabin_policy ?? "on_request";

  const stateOf = (cab: TripCabin): CabinState => {
    const kNew = ncab(cab.name);
    const kOld = ncabLegacy(cab.name);
    const look = alias[prefix + kOld] || alias[prefix + kNew] || null;
    const fc = (look && (byNorm[look] || byNorm[ncab(look)])) || byNorm[kNew] || byNorm[kOld];
    const aliasKnown = !!(look && (vocab.has(ncab(look)) || vocab.has(ncabLegacy(look))));
    if (fc) {
      const full = typeof fc.full === "number" ? fc.full : null;
      const disc = typeof fc.disc === "number" ? fc.disc : null;
      const net = disc ?? full;
      if (fc.available === false || net === null) return { state: "sold_out" };
      return { state: "priced", full, disc, net };
    }
    if (!feed) return { state: "on_request" };
    if (aliasKnown || vocab.has(kNew) || vocab.has(kOld)) return { state: "sold_out" };
    if (missingPolicy === "sold_out") return { state: "sold_out" };
    if (vocab.size) return { state: "retired" };
    return { state: "on_request" };
  };

  return detail.target.cabins
    .map((cabin, i) => ({ cabin, st: stateOf(cabin), i }))
    .sort((a, b) => {
      const ga = ORDER[a.st.state];
      const gb = ORDER[b.st.state];
      if (ga !== gb) return ga - gb;
      if (a.st.state === "priced" && b.st.state === "priced" && a.st.net !== b.st.net) return a.st.net - b.st.net;
      return a.i - b.i;
    })
    .filter((row) => row.st.state !== "retired");
}
