/**
 * Transfermarkt FIWC marktwerte → mostvaluable (48 ülke · 1-2-4-4)
 * node --env-file=.env scripts/seed-mostvaluable-from-transfermarkt.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import { pickMostValuableSquad } from "./mostplayed-squad-pick.mjs";
import { tmTeilnehmerLabelToCountryTr } from "./tm-wc-land-map.mjs";
import {
  fetchWcLandIdOptions,
  fetchWcMarktwerteLand,
} from "./transfermarkt-wc-marktwerte.mjs";
import { COUNTRY_TR } from "./worldcup-squad-pdf-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outJson = path.join(__dirname, "data", "mostvaluable.json");

const WC_COUNTRIES = new Set(Object.values(COUNTRY_TR));

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }

  const options = await fetchWcLandIdOptions();
  const targets = [];
  const unmapped = [];

  for (const { landId, label } of options) {
    const country = tmTeilnehmerLabelToCountryTr(label);
    if (!country) {
      unmapped.push({ landId, label });
      continue;
    }
    if (!WC_COUNTRIES.has(country)) continue;
    targets.push({ landId, country, label });
  }

  targets.sort((a, b) => a.country.localeCompare(b.country, "tr"));

  console.log(`TM land seçenekleri: ${options.length}, DK hedef: ${targets.length}`);
  if (unmapped.length) {
    console.warn("Eşleşmeyen etiketler:", unmapped.slice(0, 8).map((u) => u.label).join(", "));
  }

  const sql = neon(url);
  const jsonEntries = [];
  let ok = 0;
  let fail = 0;

  for (const { landId, country, label } of targets) {
    try {
      const pool = await fetchWcMarktwerteLand(landId, { delayMs: 650 });
      const squad = pickMostValuableSquad(pool);
      if (!squad) {
        console.warn(`⚠ ${country} (land ${landId} ${label}): kadro seçilemedi (${pool.length} oyuncu)`);
        fail++;
        continue;
      }
      await sql`
        INSERT INTO mostvaluable (country, players, updated_at)
        VALUES (${country}, ${JSON.stringify(squad)}::jsonb, NOW())
        ON CONFLICT (country) DO UPDATE SET
          players = EXCLUDED.players,
          updated_at = EXCLUDED.updated_at
      `;
      jsonEntries.push({ country, players: squad });
      ok++;
      console.log(`✓ ${country} (${pool.length} parse → 11 kadro)`);
    } catch (e) {
      fail++;
      console.warn(`⚠ ${country}:`, e instanceof Error ? e.message : e);
    }
  }

  jsonEntries.sort((a, b) => a.country.localeCompare(b.country, "tr"));
  fs.writeFileSync(outJson, JSON.stringify(jsonEntries, null, 2) + "\n");

  console.log(`\nmostvaluable: ${ok} ülke DB + ${outJson}`);
  if (fail) console.log(`Atlanan/hata: ${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
