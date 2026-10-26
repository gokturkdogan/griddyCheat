import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env and add your Neon URL.");
  process.exit(1);
}

const sql = neon(url);

const legacy = await sql`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'cheats'
  ) AS exists
`;

if (legacy[0]?.exists) {
  await sql`ALTER TABLE cheats RENAME TO lastseven`;
  console.log("Renamed table cheats → lastseven");
}

await sql`
  CREATE TABLE IF NOT EXISTS lastseven (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS lastseven_title_idx ON lastseven (title)`;
console.log("Table lastseven is ready.");
