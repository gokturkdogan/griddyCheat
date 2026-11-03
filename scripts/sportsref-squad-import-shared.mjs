/**
 * Sports Reference .xls (HTML) — ortak parse + ülke tespiti
 */
import fs from "node:fs";
import path from "node:path";
import { splitFullName } from "./mostplayed-squad-pick.mjs";
import { COUNTRY_TR } from "./worldcup-squad-pdf-shared.mjs";

/** ISO3 (Sports Reference birth_place csk) → FIFA PDF English key */
export const ISO3_TO_ENGLISH = {
  ALG: "Algeria",
  ARG: "Argentina",
  AUS: "Australia",
  AUT: "Austria",
  BEL: "Belgium",
  BIH: "Bosnia And Herzegovina",
  BRA: "Brazil",
  CPV: "Cabo Verde",
  CAN: "Canada",
  COL: "Colombia",
  CIV: "Côte D'Ivoire",
  HRV: "Croatia",
  CUW: "Curaçao",
  CZE: "Czechia",
  ECU: "Ecuador",
  EGY: "Egypt",
  ENG: "England",
  SCO: "Scotland",
  FRA: "France",
  GER: "Germany",
  GHA: "Ghana",
  HTI: "Haiti",
  IRN: "IR Iran",
  IRQ: "Iraq",
  JPN: "Japan",
  JOR: "Jordan",
  KOR: "Korea Republic",
  MEX: "Mexico",
  MAR: "Morocco",
  NLD: "Netherlands",
  NZL: "New Zealand",
  NOR: "Norway",
  PAN: "Panama",
  PAR: "Paraguay",
  PRY: "Paraguay",
  PRT: "Portugal",
  QAT: "Qatar",
  KSA: "Saudi Arabia",
  SAU: "Saudi Arabia",
  SEN: "Senegal",
  RSA: "South Africa",
  ZAF: "South Africa",
  ESP: "Spain",
  SWE: "Sweden",
  SUI: "Switzerland",
  TUN: "Tunisia",
  TUR: "Türkiye",
  URU: "Uruguay",
  URY: "Uruguay",
  USA: "USA",
  UZB: "Uzbekistan",
  COD: "Congo DR",
  DEU: "Germany",
  GBR: "England",
  LBR: "Liberia",
  CHE: "Switzerland",
  BFA: "Burkina Faso",
};

function normalizePos(raw) {
  return String(raw)
    .replace(/\s+/g, "")
    .replace(/，/g, ",")
    .toUpperCase();
}

export function inferSquadIso(isoCounts, ukNations = {}) {
  const sct = ukNations.SCT || 0;
  const eng = ukNations.ENG || 0;
  if (sct >= 5 && sct >= eng) return "SCO";
  if (eng >= 5 && eng > sct) return "GBR";
  let topIso = "UNK";
  let topN = 0;
  for (const [iso, n] of isoCounts) {
    if (iso === "UNK") continue;
    if (n > topN) {
      topN = n;
      topIso = iso;
    }
  }

  const diaspora = ["COD", "HTI", "CIV", "SEN", "BIH", "ALG", "CPV"];
  for (const iso of diaspora) {
    const n = isoCounts.get(iso) || 0;
    if (n < 5) continue;
    if (iso === topIso) return iso;
    if (topN > 0 && n >= topN * 0.45) return iso;
  }

  return topIso;
}

export function countryLabel(topIso) {
  const english = ISO3_TO_ENGLISH[topIso];
  if (english && COUNTRY_TR[english]) return COUNTRY_TR[english];
  if (english) return english;
  return topIso;
}

export function defaultSportsRefInputPaths() {
  const dir = path.join(process.env.USERPROFILE || "", "Downloads");
  if (!fs.existsSync(dir)) return [];

  const fileNum = (name) => {
    const m = name.match(/sportsref_download \((\d+)\)\.xls$/i);
    if (m) return Number(m[1]);
    if (/^sportsref_download\.xls$/i.test(name)) return 0;
    return -1;
  };

  return fs
    .readdirSync(dir)
    .filter((n) => fileNum(n) >= 0)
    .sort((a, b) => fileNum(a) - fileNum(b))
    .map((n) => path.join(dir, n));
}

export function fileSportsRefIndex(filePath) {
  const base = path.basename(filePath);
  const m = base.match(/sportsref_download \((\d+)\)\.xls$/i);
  if (m) return Number(m[1]);
  if (/^sportsref_download\.xls$/i.test(base)) return 0;
  return null;
}

/** FBref export sırası — doğum yeri tek başına yanıltıcı (ör. Curaçao kadrosu NLD ağırlıklı). */
const FILE_INDEX_ISO = {
  49: "CUW",
  50: "ALG",
};

export function resolveTopIso(topIso, filePath) {
  const idx = fileSportsRefIndex(filePath);
  if (idx != null && FILE_INDEX_ISO[idx]) return FILE_INDEX_ISO[idx];
  return topIso;
}

export function parseSportsRefHtml(html) {
  const rows = [...html.matchAll(/<tr data-row="\d+">([\s\S]*?)<\/tr>/gi)];
  const players = [];
  const isoCounts = new Map();
  const ukNations = { SCT: 0, ENG: 0, WLS: 0, NIR: 0 };

  for (const m of rows) {
    const row = m[0];
    const playerM = row.match(/data-stat="player"[^>]*>([^<]+)</i);
    if (!playerM) continue;
    const fullName = playerM[1].trim();

    const posM = row.match(/data-stat="position"[^>]*>([^<]+)</i);
    if (!posM) continue;
    const rawPos = normalizePos(posM[1]);

    const gamesM = row.match(/data-stat="games"[^>]*>([^<]*)</i);
    const mpRaw = gamesM ? gamesM[1].trim() : "";
    let mp = null;
    if (mpRaw !== "") {
      const n = Number(mpRaw);
      if (Number.isFinite(n)) mp = n;
    }

    const goalsM = row.match(/data-stat="goals"[^>]*>([^<]*)</i);
    const goalsRaw = goalsM ? goalsM[1].trim() : "";
    let goals = goalsRaw === "" ? 0 : Number(goalsRaw);
    if (!Number.isFinite(goals) || goals < 0) goals = 0;

    const bdM = row.match(/data-stat="birth_date">([^<]+)</i);
    const dob = bdM ? bdM[1].trim() : null;

    if (mp === null && !dob) continue;

    const bpM = row.match(/data-stat="birth_place" csk="([^"]+)"/i);
    let iso = "UNK";
    if (bpM) {
      const csk = bpM[1];
      const prefix = csk.split("-")[0].toUpperCase();
      if (/^[A-Z]{3}$/.test(prefix)) iso = prefix;
      const sub = csk.match(/^[A-Z]{3}-([A-Z]{3})-/i);
      if (sub) {
        const code = sub[1].toUpperCase();
        if (code in ukNations) ukNations[code]++;
      }
    }
    isoCounts.set(iso, (isoCounts.get(iso) || 0) + 1);

    const { name, surname } = splitFullName(fullName);
    if (!name) continue;

    players.push({
      name,
      surname,
      rawPos,
      mp: mp ?? 0,
      goals,
      dob,
    });
  }

  const topIso = inferSquadIso(isoCounts, ukNations);
  return { players, topIso, isoCounts };
}
