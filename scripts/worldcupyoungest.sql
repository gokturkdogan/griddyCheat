-- Draftinho · Dünya Kupası Serisi · En Genç Kadro
-- Sadece worldcupyoungest tablosunu ekler; lastseven veya diğer tablolara dokunmaz.
-- Neon SQL Editor'de çalıştırabilir veya: npm run db:init:worldcup-youngest

-- players: [{ "position": string, "age": number, "name": string, "surname": string }, ...]
CREATE TABLE IF NOT EXISTS worldcupyoungest (
  id SERIAL PRIMARY KEY,
  country VARCHAR(255) NOT NULL,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT worldcupyoungest_country_unique UNIQUE (country),
  CONSTRAINT worldcupyoungest_players_is_array CHECK (jsonb_typeof(players) = 'array')
);

CREATE INDEX IF NOT EXISTS worldcupyoungest_country_idx ON worldcupyoungest (country);
