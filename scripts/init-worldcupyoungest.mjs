/**
 * Yalnızca worldcupyoungest tablosunu oluşturur.
 * lastseven, cheats rename vb. mevcut yapıya dokunmaz.
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env and add your Neon URL.");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS worldcupyoungest (
    id SERIAL PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    players JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT worldcupyoungest_country_unique UNIQUE (country),
    CONSTRAINT worldcupyoungest_players_is_array CHECK (jsonb_typeof(players) = 'array')
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS worldcupyoungest_country_idx ON worldcupyoungest (country)
`;

console.log("Table worldcupyoungest is ready (existing tables unchanged).");
