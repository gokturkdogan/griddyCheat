/**
 * Transfermarkt Dünya Kupası marktwerte (FIWC) — parse + fetch
 */
import { TM_HOST } from "./tallest-current-teams.mjs";
import { splitFullName } from "./mostplayed-squad-pick.mjs";
import { mapPositionToKey } from "./transfermarkt-wc-marktwerte-pos.mjs";

export const TM_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html",
  "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
  Referer: `https://${TM_HOST}/`,
};

const BASE =
  `https://${TM_HOST}/dunya-kupasi/marktwerte/pokalwettbewerb/FIWC/plus/0/galerie`;

function parseLocalizedNumber(numStr) {
  const s = String(numStr).trim();
  if (!s) return NaN;
  if (/^\d+\.\d{1,2}$/.test(s) || /^\d+,\d{1,2}$/.test(s)) {
    return Number(s.replace(",", "."));
  }
  if (s.includes(",") && s.includes(".")) {
    return Number(s.replace(/\./g, "").replace(",", "."));
  }
  if (s.includes(",")) {
    const parts = s.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      return Number(`${parts[0].replace(/\./g, "")}.${parts[1]}`);
    }
    return Number(s.replace(/,/g, ""));
  }
  return Number(s.replace(/\./g, ""));
}

export function parseMarktwertToEur(text) {
  const raw = String(text)
    .replace(/\u00a0/g, " ")
    .replace(/€/g, "")
    .trim();
  if (!raw) return 0;

  const mn = raw.match(/([\d.,]+)\s*(?:Mn|Mio|mio|mil\.?)/i);
  if (mn) {
    const n = parseLocalizedNumber(mn[1]);
    return Number.isFinite(n) ? Math.round(n * 1_000_000) : 0;
  }

  const bin = raw.match(/([\d.,]+)\s*(?:bin|Th\.|Tsd|td)/i);
  if (bin) {
    const n = parseLocalizedNumber(bin[1]);
    return Number.isFinite(n) ? Math.round(n * 1_000) : 0;
  }

  const plain = raw.match(/^([\d.,]+)/);
  if (plain) {
    const n = parseLocalizedNumber(plain[1]);
    return Number.isFinite(n) ? Math.round(n) : 0;
  }
  return 0;
}

function squadRowSlices(html) {
  const re = /<tr class="(?:odd|even)"[^>]*>/gi;
  const starts = [];
  let m;
  while ((m = re.exec(html)) !== null) starts.push(m.index);
  starts.push(html.length);
  const rows = [];
  for (let i = 0; i < starts.length - 1; i++) {
    rows.push(html.slice(starts[i], starts[i + 1]));
  }
  return rows;
}

function extractPositionLabel(rowHtml) {
  const inline = rowHtml.match(/<table class="inline-table">([\s\S]*?)<\/table>/i);
  if (!inline) return "";
  const cells = [...inline[1].matchAll(/<td[^>]*>([^<]*)<\/td>/gi)]
    .map((m) => m[1].trim())
    .filter(Boolean);
  return cells.length >= 2 ? cells[cells.length - 1] : cells[0] ?? "";
}

function extractPlayerName(rowHtml) {
  const m = rowHtml.match(/href="[^"]*\/profil\/spieler\/\d+"[^>]*>([^<]+)</i);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function extractValueText(rowHtml) {
  const m = rowHtml.match(/class="rechts hauptlink"><a[^>]*>([^<]+)</i);
  if (m) return m[1].trim();
  const m2 = rowHtml.match(/class="rechts">([^<]+)</i);
  return m2 ? m2[1].trim() : "";
}

function playerKey(name, surname) {
  return `${String(name).trim().toLowerCase()}|${String(surname).trim().toLowerCase()}`;
}

function extractSpielerId(rowHtml) {
  const m = rowHtml.match(/\/profil\/spieler\/(\d+)/i);
  return m ? m[1] : "";
}

export function parseWcMarktwertePage(html) {
  const byId = new Map();
  for (const row of squadRowSlices(html)) {
    if (!row.includes("/spieler/")) continue;
    const fullName = extractPlayerName(row);
    if (!fullName) continue;
    const spielerId = extractSpielerId(row);
    const posLabel = extractPositionLabel(row);
    const posKey = mapPositionToKey(posLabel);
    if (!posKey) continue;
    const valueEur = parseMarktwertToEur(extractValueText(row));
    const { name, surname } = splitFullName(fullName);
    if (!name) continue;
    const key = spielerId || playerKey(name, surname);
    const prev = byId.get(key);
    if (!prev || valueEur > prev.valueEur) {
      byId.set(key, {
        name,
        surname,
        rawPos: posKey,
        valueEur,
      });
    }
  }
  return [...byId.values()];
}

export function marktwertePageUrl(landId, galerie = 0) {
  const q =
    "ausrichtung=&spielerposition_id=&altersklasse=&yearOfBirth=0&continent=&gruppe=";
  return `${BASE}/${galerie}?${q}&land_id=${landId}`;
}

export async function fetchWcMarktwerteLand(landId, options = {}) {
  const delayMs = options.delayMs ?? 700;
  const all = [];
  let page = 0;
  let maxPage = 0;

  for (;;) {
    const url = marktwertePageUrl(landId, page);
    const res = await fetch(url, { headers: TM_FETCH_HEADERS });
    if (res.status !== 200) {
      throw new Error(`TM ${landId} page ${page}: HTTP ${res.status}`);
    }
    const html = await res.text();
    const batch = parseWcMarktwertePage(html);
    if (batch.length === 0 && page > 0) break;
    all.push(...batch);

    const pages = [...html.matchAll(/galerie\/(\d+)/g)].map((m) => Number(m[1]));
    if (pages.length) maxPage = Math.max(maxPage, ...pages);

    if (page >= maxPage) break;
    page++;
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }

  return all;
}

const TEILNEHMER_URL = `https://${TM_HOST}/dunya-kupasi/teilnehmer/pokalwettbewerb/FIWC`;

/** FIWC katılımcı tablosu: bayrak URL'sindeki id = marktwerte land_id */
export function parseTeilnehmerLandOptions(html) {
  const byLand = new Map();
  const rowRe =
    /<tr class="(?:odd|even)"[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = rowRe.exec(html)) !== null) {
    const row = m[1];
    if (!row.includes("/startseite/verein/")) continue;
    const title = row.match(/<a title="([^"]+)" href="[^"]+\/startseite\/verein\/\d+"/i)?.[1]?.trim();
    const landId = Number(row.match(/flagge\/tiny\/(\d+)\.png/i)?.[1]);
    if (!title || !Number.isFinite(landId) || landId <= 0) continue;
    if (!byLand.has(landId)) byLand.set(landId, title);
  }
  return [...byLand.entries()]
    .map(([landId, label]) => ({ landId, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "tr"));
}

export function parseLandIdOptions(html) {
  const select = html.match(/name="land_id"[\s\S]*?<\/select>/i);
  if (select) {
    return [...select[0].matchAll(/value="(\d+)"[^>]*>([^<]+)</g)]
      .filter((m) => m[1] !== "0")
      .map((m) => ({ landId: Number(m[1]), label: m[2].trim() }));
  }
  return parseTeilnehmerLandOptions(html);
}

export async function fetchWcLandIdOptions() {
  const res = await fetch(TEILNEHMER_URL, { headers: TM_FETCH_HEADERS });
  if (res.status !== 200) {
    throw new Error(`TM teilnehmer: HTTP ${res.status}`);
  }
  const html = await res.text();
  return parseTeilnehmerLandOptions(html);
}
