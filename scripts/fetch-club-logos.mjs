/**
 * Kulüp amblemlerini Transfermarkt → public/clubs (tek seferlik).
 * node scripts/fetch-club-logos.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "clubs");

const CLUBS = [
  ["Arsenal", 11, "arsenal"],
  ["Galatasaray", 141, "galatasaray"],
  ["Fenerbahçe", 36, "fenerbahce"],
  ["Rizespor", 126, "rizespor"],
  ["Barcelona", 131, "barcelona"],
  ["Real Madrid", 418, "real-madrid"],
  ["Ajax", 610, "ajax"],
  ["Beşiktaş", 114, "besiktas"],
  ["Trabzonspor", 449, "trabzonspor"],
  ["Marseille", 244, "marseille"],
  ["Lyon", 1041, "lyon"],
  ["Lille", 1082, "lille"],
  ["Tottenham", 148, "tottenham"],
];

await fs.mkdir(OUT_DIR, { recursive: true });

for (const [team, vereinId, fileKey] of CLUBS) {
  const url = `https://img.a.transfermarkt.technology/wappen/head/${vereinId}.png`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; GriddyClubLogos/1.0)" },
  });
  if (!res.ok) {
    console.warn(`⚠ ${team}: HTTP ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(path.join(OUT_DIR, `${fileKey}.png`), buf);
  console.log(`✓ ${team} → clubs/${fileKey}.png`);
}

console.log("Kulüp logoları hazır.");
