/**
 * Artık kullanılmayan tablolar (En Ağır Kadro / StatMuse dönemi).
 *
 * node --env-file=.env scripts/drop-legacy-tables.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(url);

async function tableExists(name) {
  const rows = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = ${name}
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

if (await tableExists("heavy_current")) {
  await sql`DROP TABLE heavy_current CASCADE`;
  console.log("✓ heavy_current silindi");
} else {
  console.log("— heavy_current: yok, atlandı");
}

if (await tableExists("heavysquad")) {
  await sql`DROP TABLE heavysquad CASCADE`;
  console.log("✓ heavysquad silindi");
} else {
  console.log("— heavysquad: yok, atlandı");
}

console.log("Legacy tablo temizliği bitti.");
