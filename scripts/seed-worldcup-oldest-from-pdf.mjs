/**
 * FIFA WC2026 Squad PDF → oldestworldcup
 * En yaşlı: 2 GK · 5 DF · 5 MF · 3 FW (15 oyuncu) · aynı PDF ve referans tarihi
 *
 * Kullanım: node --env-file=.env scripts/seed-worldcup-oldest-from-pdf.mjs [pdf-path]
 */
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import {
  COUNTRY_TR,
  defaultPdfPath,
  loadSquadsFromPdf,
  pickSquad,
} from "./worldcup-squad-pdf-shared.mjs";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }

  const pdfPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultPdfPath();

  if (!fs.existsSync(pdfPath)) {
    console.error("PDF not found:", pdfPath);
    process.exit(1);
  }

  const squads = await loadSquadsFromPdf(pdfPath);
  const sql = neon(url);

  let upserted = 0;
  let failed = 0;

  for (const [english, players] of squads) {
    const country = COUNTRY_TR[english] ?? english;
    const squad = pickSquad(players, "oldest");
    if (!squad) {
      console.warn(`⚠ Kadro seçilemedi (${english}): pozisyon yetersiz`);
      failed++;
      continue;
    }

    await sql`
      INSERT INTO oldestworldcup (country, players, updated_at)
      VALUES (${country}, ${JSON.stringify(squad)}::jsonb, NOW())
      ON CONFLICT (country) DO UPDATE SET
        players = EXCLUDED.players,
        updated_at = EXCLUDED.updated_at
    `;
    upserted++;
  }

  console.log(`Tamam: ${upserted} ülke güncellendi (en yaşlı · 15 oyuncu).`);
  if (failed) console.log(`Uyarı: ${failed} ülke atlandı (kadro yetersiz).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
