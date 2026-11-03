import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS tallest_current (
    id SERIAL PRIMARY KEY,
    team VARCHAR(255) NOT NULL,
    players JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tallest_current_team_unique UNIQUE (team),
    CONSTRAINT tallest_current_players_is_array CHECK (jsonb_typeof(players) = 'array')
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS tallest_current_team_idx ON tallest_current (team)
`;

console.log("Table tallest_current is ready.");
