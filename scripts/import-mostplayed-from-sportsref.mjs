/**
 * Sports Reference .xls → mostplayed, mostgoals, worldcup-youngest, worldcup-oldest JSON
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  pickMostGoalsSquad,
  pickMostPlayedSquad,
} from "./mostplayed-squad-pick.mjs";
import {
  countryLabel,
  defaultSportsRefInputPaths,
  parseSportsRefHtml,
  resolveTopIso,
} from "./sportsref-squad-import-shared.mjs";
import { pickAgeSquadFromSportsRef } from "./worldcup-sportsref-age-pick.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadJsonMap(filePath) {
  const map = new Map();
  if (!fs.existsSync(filePath)) return map;
  for (const e of JSON.parse(fs.readFileSync(filePath, "utf8"))) {
    if (e?.country) map.set(e.country, e);
  }
  return map;
}

function writeSortedMap(map, outPath) {
  const entries = [...map.values()].sort((a, b) =>
    a.country.localeCompare(b.country, "tr"),
  );
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2) + "\n");
  return entries.length;
}

async function main() {
  const args = process.argv.slice(2);
  const files =
    args.length > 0
      ? args.map((a) => path.resolve(a))
      : defaultSportsRefInputPaths();

  const dataDir = path.join(__dirname, "data");
  const playedPath = path.join(dataDir, "mostplayed.json");
  const goalsPath = path.join(dataDir, "mostgoals.json");
  const youngestPath = path.join(dataDir, "worldcup-youngest.json");
  const oldestPath = path.join(dataDir, "worldcup-oldest.json");

  const byPlayed = loadJsonMap(playedPath);
  const byGoals = loadJsonMap(goalsPath);
  const byYoungest = loadJsonMap(youngestPath);
  const byOldest = loadJsonMap(oldestPath);

  console.log(
    `Mevcut: maç ${byPlayed.size}, gol ${byGoals.size}, genç ${byYoungest.size}, yaşlı ${byOldest.size}`,
  );

  if (files.length === 0) {
    console.error("Downloads’ta sportsref_download*.xls bulunamadı.");
    process.exit(1);
  }

  console.log(`Taranacak dosya: ${files.length}`);

  const skipped = [];

  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const { players, topIso, isoCounts } = parseSportsRefHtml(html);
    const country = countryLabel(resolveTopIso(topIso, file));

    const squadPlayed = pickMostPlayedSquad(players);
    const squadGoals = pickMostGoalsSquad(players);
    const squadYoungest = pickAgeSquadFromSportsRef(players, "youngest");
    const squadOldest = pickAgeSquadFromSportsRef(players, "oldest");

    if (!squadPlayed || !squadGoals || !squadYoungest || !squadOldest) {
      skipped.push(
        `${path.basename(file)} → ${country} (kadro eksik: MP=${!!squadPlayed} gol=${!!squadGoals} genç=${!!squadYoungest} yaşlı=${!!squadOldest})`,
      );
      continue;
    }

    byPlayed.set(country, { country, players: squadPlayed });
    byGoals.set(country, { country, players: squadGoals });
    byYoungest.set(country, { country, players: squadYoungest });
    byOldest.set(country, { country, players: squadOldest });

    console.log(`✓ ${path.basename(file)} → ${country}`);
    if (isoCounts.size > 1) {
      const mix = [...isoCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k, v]) => `${k}:${v}`)
        .join(" ");
      console.log(`  ${mix}`);
    }
  }

  const nPlayed = writeSortedMap(byPlayed, playedPath);
  const nGoals = writeSortedMap(byGoals, goalsPath);
  const nYoung = writeSortedMap(byYoungest, youngestPath);
  const nOld = writeSortedMap(byOldest, oldestPath);

  console.log(`\nmostplayed: ${nPlayed}`);
  console.log(`mostgoals: ${nGoals}`);
  console.log(`worldcup-youngest: ${nYoung}`);
  console.log(`worldcup-oldest: ${nOld}`);

  if (skipped.length) {
    console.log("\nAtlanan:");
    for (const s of skipped) console.log(" ", s);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
