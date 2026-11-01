-- Draftinho · Dünya Kupası Serisi · En Yaşlı Kadro
-- Sadece oldestworldcup tablosunu ekler; diğer tablolara dokunmaz.
-- Neon SQL Editor'de çalıştırabilir veya: npm run db:init:oldest-worldcup

-- players: [{ "position": string, "age": number, "name": string, "surname": string }, ...]
CREATE TABLE IF NOT EXISTS oldestworldcup (
  id SERIAL PRIMARY KEY,
  country VARCHAR(255) NOT NULL,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT oldestworldcup_country_unique UNIQUE (country),
  CONSTRAINT oldestworldcup_players_is_array CHECK (jsonb_typeof(players) = 'array')
);

CREATE INDEX IF NOT EXISTS oldestworldcup_country_idx ON oldestworldcup (country);
