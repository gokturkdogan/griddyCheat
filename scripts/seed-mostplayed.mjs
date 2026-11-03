/**
 * mostplayed — JSON dosyasından toplu yükleme
 *
 * Dosya: scripts/data/mostplayed.json
 * [
 *   { "country": "Türkiye", "players": [ { "position", "name", "surname", "caps" }, ... ] },
 *   ...
 * ]
 *
 * node --env-file=.env scripts/seed-mostplayed.mjs [json-path]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultJson = path.join(__dirname, "data", "mostplayed.json");

function validatePlayers(players) {
  if (!Array.isArray(players) || players.length === 0) return null;
  const out = [];
  for (const item of players) {
    if (!item || typeof item !== "object") return null;
    const position = String(item.position ?? "").trim();
    const name = String(item.name ?? "").trim();
    const surname = String(item.surname ?? "").trim();
    const caps = Number(item.caps);
    if (!position || !name || !Number.isFinite(caps) || caps < 0) return null;
    out.push({ position, name, surname, caps: Math.round(caps) });
  }
  return out;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }

  const jsonPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : defaultJson;

  if (!fs.existsSync(jsonPath)) {
    console.error("JSON not found:", jsonPath);
    process.exit(1);
  }

  const entries = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  if (!Array.isArray(entries)) {
    console.error("JSON root must be an array");
    process.exit(1);
  }

  const sql = neon(url);
  let ok = 0;

  for (const entry of entries) {
    const country = String(entry.country ?? "").trim();
    const players = validatePlayers(entry.players);
    if (!country || !players) {
      console.warn("⚠ Atlandı (geçersiz kayıt):", entry.country ?? "?");
      continue;
    }

    await sql`
      INSERT INTO mostplayed (country, players, updated_at)
      VALUES (${country}, ${JSON.stringify(players)}::jsonb, NOW())
      ON CONFLICT (country) DO UPDATE SET
        players = EXCLUDED.players,
        updated_at = EXCLUDED.updated_at
    `;
    ok++;
  }

  console.log(`mostplayed seed: ${ok} ülke güncellendi (mevcut kayıtlar silinmedi).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
