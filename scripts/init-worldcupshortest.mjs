/**
 * Yalnızca worldcupshortest tablosunu oluşturur.
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS worldcupshortest (
    id SERIAL PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    players JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT worldcupshortest_country_unique UNIQUE (country),
    CONSTRAINT worldcupshortest_players_is_array CHECK (jsonb_typeof(players) = 'array')
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS worldcupshortest_country_idx ON worldcupshortest (country)
`;

console.log("Table worldcupshortest is ready.");
