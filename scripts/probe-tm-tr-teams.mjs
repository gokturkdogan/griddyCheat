/**
 * TM TR slug + parse doğrulama
 * node --env-file=.env scripts/probe-tm-tr-teams.mjs
 */
import { fetchTransfermarktRoster } from "./transfermarkt-roster-parse.mjs";
import { pickTallestSquad } from "./tallest-squad-pick.mjs";

const HOST = "www.transfermarkt.com.tr";
const SEASON = 2026;

const TEAMS = [
  { team: "Arsenal", slugs: ["fc-arsenal", "arsenal-fc"], vereinId: 11 },
  { team: "Galatasaray", slugs: ["galatasaray-sk"], vereinId: 141 },
  { team: "Fenerbahçe", slugs: ["fenerbahce", "fenerbahce-sk"], vereinId: 36 },
  {
    team: "Rizespor",
    slugs: ["caykur-rizespor", "rizespor", "caykur-rizespor-sk"],
    vereinId: 126,
  },
  { team: "Barcelona", slugs: ["fc-barcelona", "barcelona"], vereinId: 131 },
  { team: "Real Madrid", slugs: ["real-madrid"], vereinId: 418 },
  { team: "Ajax", slugs: ["ajax-amsterdam", "ajax"], vereinId: 610 },
  { team: "Beşiktaş", slugs: ["besiktas-jk", "besiktas"], vereinId: 114 },
  { team: "Trabzonspor", slugs: ["trabzonspor"], vereinId: 449 },
  {
    team: "Marseille",
    slugs: ["olympique-marseille", "marseille"],
    vereinId: 244,
  },
  { team: "Lyon", slugs: ["olympique-lyon", "olympique-lyonas"], vereinId: 1041 },
  { team: "Lille", slugs: ["losc-lille", "lille"], vereinId: 1082 },
  {
    team: "Tottenham",
    slugs: ["tottenham-hotspur", "tottenham"],
    vereinId: 148,
  },
];

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html",
  "Accept-Language": "tr-TR,tr;q=0.9",
  Referer: "https://www.transfermarkt.com.tr/",
};

async function trySlug(slug, vereinId) {
  const url = `https://${HOST}/${slug}/kader/verein/${vereinId}/plus/1?saison_id=${SEASON}`;
  const res = await fetch(url, { headers });
  const html = await res.text();
  if (res.status !== 200 || html.length < 10000) {
    return { url, ok: false, reason: `http ${res.status} len ${html.length}` };
  }
  const roster = await fetchTransfermarktRoster(slug, vereinId, SEASON, {
    host: HOST,
  });
  const squad = pickTallestSquad(roster);
  const c = { GK: 0, DF: 0, MF: 0, FW: 0 };
  for (const p of roster) c[p.posKey]++;
  return {
    url,
    ok: Boolean(squad),
    n: roster.length,
    c,
    squad: squad?.length ?? 0,
  };
}

for (const t of TEAMS) {
  let best = null;
  for (const slug of t.slugs) {
    const r = await trySlug(slug, t.vereinId);
    if (r.ok && (!best || r.n > best.n)) best = { slug, ...r };
    if (r.n > 0 && !best) best = { slug, ...r };
    await new Promise((x) => setTimeout(x, 600));
  }
  console.log(
    t.team,
    best
      ? `slug=${best.slug} parse=${best.n} ${JSON.stringify(best.c)} squad=${best.squad}`
      : "NO SLUG WORKED",
  );
}
