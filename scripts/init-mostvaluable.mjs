/**
 * mostvaluable tablosu — DK en değerli kadrolar (Transfermarkt FIWC)
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS mostvaluable (
    id SERIAL PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    players JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT mostvaluable_country_unique UNIQUE (country),
    CONSTRAINT mostvaluable_players_is_array CHECK (jsonb_typeof(players) = 'array')
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS mostvaluable_country_idx ON mostvaluable (country)
`;

console.log("Table mostvaluable is ready.");
