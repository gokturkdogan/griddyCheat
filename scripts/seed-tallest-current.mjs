/**
 * tallest_current — Transfermarkt kader + en uzun 2-4-4-4
 *
 * node --env-file=.env scripts/seed-tallest-current.mjs
 */
import { neon } from "@neondatabase/serverless";
import { TALLEST_CURRENT_TEAMS, TM_HOST, TM_SEASON_ID } from "./tallest-current-teams.mjs";
import { fetchTransfermarktRoster } from "./transfermarkt-roster-parse.mjs";
import { pickTallestSquad } from "./tallest-squad-pick.mjs";

const DELAY_MS = Number(process.env.TRANSFERMARKT_DELAY_MS || 1200);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function upsertTeam(sql, team, players) {
  await sql`
    INSERT INTO tallest_current (team, players, updated_at)
    VALUES (${team}, ${JSON.stringify(players)}::jsonb, NOW())
    ON CONFLICT (team) DO UPDATE SET
      players = EXCLUDED.players,
      updated_at = EXCLUDED.updated_at
  `;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }

  const sql = neon(url);
  let ok = 0;

  for (const cfg of TALLEST_CURRENT_TEAMS) {
    try {
      const roster = await fetchTransfermarktRoster(
        cfg.slug,
        cfg.vereinId,
        cfg.seasonId ?? TM_SEASON_ID,
        { host: cfg.tmHost ?? TM_HOST },
      );
      const squad = pickTallestSquad(roster);
      if (!squad) {
        console.warn(
          `⚠ ${cfg.team}: mevki/boy yetersiz (${roster.length} oyuncu parse)`,
        );
        await sleep(DELAY_MS);
        continue;
      }
      await upsertTeam(sql, cfg.team, squad);
      console.log(`✓ ${cfg.team}: ${squad.length} oyuncu`);
      ok++;
    } catch (e) {
      console.warn(`⚠ ${cfg.team}:`, e.message);
    }
    await sleep(DELAY_MS);
  }

  console.log(`tallest_current seed bitti. ✓ ${ok}/${TALLEST_CURRENT_TEAMS.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
