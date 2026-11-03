/**
 * Transfermarkt kader (plus) HTML → oyuncu + boy (cm).
 */

import { splitPlayerName } from "./tallest-squad-pick.mjs";

const HEIGHT_RE = /class="zentriert">(\d)[,.](\d{2})\s*m/i;

function squadRowSlices(html) {
  const re = /<tr class="(odd|even)"[^>]*>/gi;
  const starts = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    starts.push(m.index);
  }
  starts.push(html.length);
  const rows = [];
  for (let i = 0; i < starts.length - 1; i++) {
    rows.push(html.slice(starts[i], starts[i + 1]));
  }
  return rows;
}

function parseHeightCm(rowHtml) {
  const m = rowHtml.match(HEIGHT_RE);
  if (!m) return null;
  return Number(`${m[1]}${m[2]}`);
}

function mapPositionToKey(text) {
  const t = String(text).toLowerCase();
  if (t.includes("goalkeeper") || t.includes("kaleci") || t === "gk") return "GK";
  if (
    t.includes("defender") ||
    t.includes("defans") ||
    t.includes("back") ||
    t.includes("bek") ||
    t.includes("stoper") ||
    t.includes("centre-back") ||
    t.includes("center-back") ||
    t === "df"
  ) {
    return "DF";
  }
  if (
    t.includes("midfield") ||
    t.includes("orta saha") ||
    t.includes("orta-saha") ||
    t.includes("libero") ||
    t.includes("on numara") ||
    t.includes("midfielder") ||
    t === "mf"
  ) {
    return "MF";
  }
  if (
    t.includes("forward") ||
    t.includes("forvet") ||
    t.includes("santrafor") ||
    t.includes("kanat") ||
    t.includes("winger") ||
    t.includes("striker") ||
    t.includes("attack") ||
    t === "fw"
  ) {
    return "FW";
  }
  return null;
}

function extractPlayerName(rowHtml) {
  const profil = rowHtml.match(
    /href="[^"]*\/profil\/spieler\/\d+"[^>]*>\s*([^<]+)/i,
  );
  if (profil) return profil[1].replace(/\s+/g, " ").trim();
  return "";
}

/** Güncel kulüp — .com plus: kulüp sütunu boydan önce; .tr plus: boydan önce link yok → null. */
function extractCurrentClubVereinId(rowHtml) {
  const heightIdx = rowHtml.search(/<td class="zentriert">\s*\d[,.]\d{2}\s*m/i);
  if (heightIdx < 0) return null;
  const before = rowHtml.slice(0, heightIdx);
  const clubs = [
    ...before.matchAll(
      /<td class="zentriert">\s*<a[^>]+href="[^"]*\/verein\/(\d+)/gi,
    ),
  ];
  if (clubs.length === 0) return null;
  return Number(clubs[clubs.length - 1][1]);
}

function extractPosition(rowHtml) {
  const inline = rowHtml.match(/class="inline-table"[\s\S]*?<\/table>/i);
  if (inline) {
    const cells = [...inline[0].matchAll(/<td[^>]*>([^<]+)</gi)]
      .map((m) => m[1].trim())
      .filter(Boolean);
    for (const text of cells) {
      const key = mapPositionToKey(text);
      if (key) return key;
    }
  }
  const shirt = rowHtml.match(/bg_Torwart[^"]*"[^>]*title="([^"]+)"/i);
  if (shirt) {
    const key = mapPositionToKey(shirt[1]);
    if (key) return key;
  }
  return null;
}

export function parseTransfermarktKaderHtml(html, options = {}) {
  const { vereinId = null, requireClubMatch = vereinId != null } = options;
  const byKey = new Map();

  for (const row of squadRowSlices(html)) {
    if (!row.includes("posrela")) continue;

    if (requireClubMatch && vereinId != null) {
      const clubId = extractCurrentClubVereinId(row);
      if (clubId != null && clubId !== vereinId) continue;
    }

    const display = extractPlayerName(row);
    if (!display) continue;

    const height_cm = parseHeightCm(row);
    if (height_cm == null || height_cm < 150 || height_cm > 220) continue;

    const posKey = extractPosition(row);
    if (!posKey) continue;

    const { name, surname } = splitPlayerName(display);
    if (!name) continue;

    const key = `${display}|${posKey}`;
    const prev = byKey.get(key);
    if (!prev || height_cm > prev.height_cm) {
      byKey.set(key, { name, surname, posKey, height_cm });
    }
  }

  return [...byKey.values()];
}

export function transfermarktKaderUrl(slug, vereinId, seasonId, options = {}) {
  const host = options.host ?? "www.transfermarkt.com";
  const base = `https://${host}/${slug}/kader/verein/${vereinId}/plus/1`;
  if (seasonId != null) {
    return `${base}?saison_id=${seasonId}`;
  }
  return base;
}

export async function fetchTransfermarktRoster(slug, vereinId, seasonId, options = {}) {
  const host = options.host ?? "www.transfermarkt.com";
  const url = transfermarktKaderUrl(slug, vereinId, seasonId, { host });
  const acceptLanguage =
    host.includes(".com.tr") ? "tr-TR,tr;q=0.9,en;q=0.8" : "en-US,en;q=0.9";
  const referer = `https://${host}/`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": acceptLanguage,
      Referer: referer,
    },
  });
  if (!res.ok) {
    throw new Error(`Transfermarkt HTTP ${res.status}`);
  }
  const html = await res.text();
  if (html.length < 5000) {
    throw new Error("Transfermarkt yanıtı çok kısa (engellenmiş olabilir)");
  }
  return parseTransfermarktKaderHtml(html, { vereinId });
}
