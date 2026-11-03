/**
 * FIFA WC2026 squad PDF — paylaşılan parse + kadro seçimi (2 GK · 5 DF · 5 MF · 3 FW)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
export const pdfParse = require("pdf-parse");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const REF_DATE = new Date(2026, 5, 11);

export const SQUAD_NEED = { GK: 2, DF: 5, MF: 5, FW: 3 };

export const POS_TR = {
  GK: "Kaleci",
  DF: "Defans",
  MF: "Orta saha",
  FW: "Forvet",
};

/** PDF İngilizce ülke adı → UI (Türkçe) */
export const COUNTRY_TR = {
  Algeria: "Cezayir",
  Argentina: "Arjantin",
  Australia: "Avustralya",
  Austria: "Avusturya",
  Belgium: "Belçika",
  "Bosnia And Herzegovina": "Bosna Hersek",
  Brazil: "Brezilya",
  "Cabo Verde": "Yeşil Burun",
  Canada: "Kanada",
  Colombia: "Kolombiya",
  "Congo DR": "Kongo DC",
  "Côte D'Ivoire": "Fildişi Sahili",
  Croatia: "Hırvatistan",
  Curaçao: "Curaçao",
  Czechia: "Çekya",
  Ecuador: "Ekvador",
  Egypt: "Mısır",
  England: "İngiltere",
  France: "Fransa",
  Germany: "Almanya",
  Ghana: "Gana",
  Haiti: "Haiti",
  "IR Iran": "İran",
  Iraq: "Irak",
  Japan: "Japonya",
  Jordan: "Ürdün",
  "Korea Republic": "Güney Kore",
  Mexico: "Meksika",
  Morocco: "Fas",
  Netherlands: "Hollanda",
  "New Zealand": "Yeni Zelanda",
  Norway: "Norveç",
  Panama: "Panama",
  Paraguay: "Paraguay",
  Portugal: "Portekiz",
  Qatar: "Katar",
  "Saudi Arabia": "Suudi Arabistan",
  Scotland: "İskoçya",
  Senegal: "Senegal",
  "South Africa": "Güney Afrika",
  Spain: "İspanya",
  Sweden: "İsveç",
  Switzerland: "İsviçre",
  Tunisia: "Tunus",
  Türkiye: "Türkiye",
  Uruguay: "Uruguay",
  USA: "ABD",
  Uzbekistan: "Özbekistan",
};

export function defaultPdfPath() {
  const inRepo = path.join(__dirname, "..", "attachments", "SquadLists-English.pdf");
  const fromAttachments =
    "c:\\Users\\goktu\\.cursor\\projects\\c-Users-goktu-OneDrive-Masa-st-Projects-griddyCheat\\attachments\\7026fd65-f01e-47cf-91f2-04f819903a29\\SquadLists-English.pdf";
  if (fs.existsSync(inRepo)) return inRepo;
  if (fs.existsSync(fromAttachments)) return fromAttachments;
  return inRepo;
}

function ageAt(dobStr) {
  const [d, m, y] = dobStr.split("/").map(Number);
  const birth = new Date(y, m - 1, d);
  let age = REF_DATE.getFullYear() - birth.getFullYear();
  const md = REF_DATE.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && REF_DATE.getDate() < birth.getDate())) age--;
  return age;
}

function dobToTime(dobStr) {
  const [d, m, y] = dobStr.split("/").map(Number);
  return new Date(y, m - 1, d).getTime();
}

function toTitle(s) {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function parseNameFromBlob(blob) {
  const raw = blob.trim();

  let m = raw.match(
    /^([A-ZÀ-ÖØ-Ý][A-Za-zÀ-öø-ÿ\-']+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-öø-ÿ\-']+)*?)\s+([A-Z][a-zà-ÿ]+)\2/,
  );
  if (m) {
    return { name: m[2], surname: toTitle(m[1]) };
  }

  m = raw.match(/^([A-Z]+)([A-Z][a-zà-ÿ]+)\2/);
  if (m) {
    return { name: m[2], surname: toTitle(m[1]) };
  }

  m = raw.match(/^([A-Z]+)\s+([A-Z][a-zà-ÿ]+)([A-Z][a-zà-ÿ]+)\3/);
  if (m) {
    return { name: m[2], surname: toTitle(m[1]) };
  }

  m = raw.match(/^([A-Z]+)([A-Z][a-zà-ÿ]{2,})([A-Z][a-zà-ÿ]+)\2/);
  if (m) {
    return { name: m[2], surname: toTitle(m[1]) };
  }

  m = raw.match(/^([A-Z][a-zà-ÿ]{2,})([A-ZÀ-ÖØ-Ý].+)$/);
  if (m && !/^[A-Z]{2,}$/.test(m[1])) {
    return { name: m[1], surname: "" };
  }

  m = raw.match(/^([A-Z][A-Za-z\-']+)\s+([A-Za-zÀ-öø-ÿ]+)/);
  if (m) {
    return { name: m[2].split(/\s+/)[0], surname: toTitle(m[1]) };
  }

  return { name: raw.slice(0, 24), surname: "" };
}

/** DOB sonrası segmentten HEIGHT (CM) */
function parseHeightAfterDob(tail) {
  const afterClub = tail.match(/\)\s*(\d{3})(\d+)/);
  if (afterClub) {
    const h = Number(afterClub[1]);
    if (h >= 150 && h <= 220) return h;
  }
  const table = tail.match(/\|\s*(\d{2,3})\s*\|\s*\d+/);
  if (table) return Number(table[1]);
  const nums = [...tail.matchAll(/\b(1[5-9]\d|2[0-2]\d)\b/g)].map((m) =>
    Number(m[1]),
  );
  if (nums.length === 0) return null;
  return nums[0];
}

export function parseSquads(text) {
  const headerRe = /\n([^\n]+?) \(([A-Z]{3})\)\n#POSPLAYER/g;
  const headers = [...text.matchAll(headerRe)];
  const squads = new Map();

  for (let i = 0; i < headers.length; i++) {
    const english = headers[i][1].trim();
    const start = headers[i].index + headers[i][0].length;
    const end = i + 1 < headers.length ? headers[i + 1].index : text.length;
    const block = text.slice(start, end);

    const players = [];
    const lineRe = /^(GK|DF|MF|FW)(.+?)(\d{2}\/\d{2}\/\d{4})/gm;
    let match;
    while ((match = lineRe.exec(block)) !== null) {
      const pos = match[1];
      const rest = block.slice(match.index + match[0].length);
      const nextIdx = rest.search(/(?:GK|DF|MF|FW)(?=[A-Z])/);
      const tail =
        nextIdx >= 0 ? rest.slice(0, nextIdx) : rest.split("ROLE")[0];
      const { name, surname } = parseNameFromBlob(match[2]);
      const dob = match[3];
      const height_cm = parseHeightAfterDob(tail);
      if (height_cm == null || height_cm < 150 || height_cm > 220) continue;
      players.push({
        pos,
        name,
        surname,
        dob,
        age: ageAt(dob),
        dobTime: dobToTime(dob),
        height_cm,
      });
    }

    if (players.length === 0) {
      console.warn(`⚠ Oyuncu bulunamadı: ${english}`);
      continue;
    }

    squads.set(english, players);
  }

  return squads;
}

/**
 * @param {"youngest"|"oldest"} mode
 */
export function pickSquad(players, mode) {
  const byPos = { GK: [], DF: [], MF: [], FW: [] };
  for (const p of players) {
    if (byPos[p.pos]) byPos[p.pos].push(p);
  }

  const sortDir = mode === "youngest" ? (a, b) => b.dobTime - a.dobTime : (a, b) => a.dobTime - b.dobTime;
  for (const k of Object.keys(byPos)) {
    byPos[k].sort(sortDir);
  }

  for (const pos of ["GK", "DF", "MF", "FW"]) {
    if (byPos[pos].length < SQUAD_NEED[pos]) {
      return null;
    }
  }

  const row = (p) => ({
    position: POS_TR[p.pos],
    age: p.age,
    name: p.name,
    surname: p.surname,
  });

  return [
    ...byPos.GK.slice(0, SQUAD_NEED.GK).map(row),
    ...byPos.DF.slice(0, SQUAD_NEED.DF).map(row),
    ...byPos.MF.slice(0, SQUAD_NEED.MF).map(row),
    ...byPos.FW.slice(0, SQUAD_NEED.FW).map(row),
  ];
}

/**
 * @param {"tallest"|"shortest"} mode
 */
export function pickSquadByHeight(players, mode) {
  const byPos = { GK: [], DF: [], MF: [], FW: [] };
  for (const p of players) {
    if (byPos[p.pos]) byPos[p.pos].push(p);
  }

  const sortDir =
    mode === "tallest"
      ? (a, b) => b.height_cm - a.height_cm
      : (a, b) => a.height_cm - b.height_cm;
  for (const k of Object.keys(byPos)) {
    byPos[k].sort(sortDir);
  }

  for (const pos of ["GK", "DF", "MF", "FW"]) {
    if (byPos[pos].length < SQUAD_NEED[pos]) {
      return null;
    }
  }

  const row = (p) => ({
    position: POS_TR[p.pos],
    height_cm: p.height_cm,
    name: p.name,
    surname: p.surname,
  });

  return [
    ...byPos.GK.slice(0, SQUAD_NEED.GK).map(row),
    ...byPos.DF.slice(0, SQUAD_NEED.DF).map(row),
    ...byPos.MF.slice(0, SQUAD_NEED.MF).map(row),
    ...byPos.FW.slice(0, SQUAD_NEED.FW).map(row),
  ];
}

export async function loadSquadsFromPdf(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const { text } = await pdfParse(buf);
  return parseSquads(text);
}
