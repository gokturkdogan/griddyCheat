/**
 * FIFA SquadLists-English.pdf → worldcuptallest (2 GK · 5 DF · 5 MF · 3 FW, en uzun)
 */
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import {
  COUNTRY_TR,
  defaultPdfPath,
  loadSquadsFromPdf,
  pickSquadByHeight,
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
    const squad = pickSquadByHeight(players, "tallest");
    if (!squad) {
      console.warn(`⚠ Kadro seçilemedi (${english}): pozisyon/boy yetersiz`);
      failed++;
      continue;
    }

    await sql`
      INSERT INTO worldcuptallest (country, players, updated_at)
      VALUES (${country}, ${JSON.stringify(squad)}::jsonb, NOW())
      ON CONFLICT (country) DO UPDATE SET
        players = EXCLUDED.players,
        updated_at = EXCLUDED.updated_at
    `;
    upserted++;
  }

  console.log(`Tamam: ${upserted} ülke → worldcuptallest (en uzun · 15 oyuncu).`);
  if (failed) console.log(`Uyarı: ${failed} ülke atlandı.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
