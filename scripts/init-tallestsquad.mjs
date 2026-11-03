import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS tallestsquad (
    id SERIAL PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    era VARCHAR(32) NOT NULL,
    players JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tallestsquad_era_check CHECK (era IN ('current', 'all_time')),
    CONSTRAINT tallestsquad_country_era_unique UNIQUE (country, era),
    CONSTRAINT tallestsquad_players_is_array CHECK (jsonb_typeof(players) = 'array')
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS tallestsquad_country_era_idx ON tallestsquad (country, era)
`;

console.log("Table tallestsquad is ready.");
