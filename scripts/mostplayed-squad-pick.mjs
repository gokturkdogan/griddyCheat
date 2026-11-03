/** mostplayed kadro seçimi — varsayılan 1 GK · 2 DF · 4 MF · 4 FW */

export const MOST_PLAYED_NEED = { GK: 1, DF: 2, MF: 4, FW: 4 };

/** Kadro tamamlanırken mevki yedekleri (sırayla) */
const FORMATION_BACKFILL = {
  GK: ["DF", "MF", "FW"],
  DF: ["MF", "FW"],
  MF: ["FW", "DF"],
  FW: ["MF"],
};

export const POS_TR = {
  GK: "Kaleci",
  DF: "Defans",
  MF: "Orta saha",
  FW: "Forvet",
};

function posKeys(raw) {
  return String(raw)
    .toUpperCase()
    .split(/[,/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function eligible(rawPos, key) {
  return posKeys(rawPos).includes(key);
}

/**
 * @param {{ rawPos: string, mp?: number, goals?: number, name: string, surname: string }[]} pool
 * @param {{ sortKey: "mp" | "goals", resultKey: "caps" | "goals" }} stat
 */
export function pickFormationSquad(pool, stat, need = MOST_PLAYED_NEED) {
  const { sortKey, resultKey } = stat;
  const remaining = [...pool].sort(
    (a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0),
  );
  const picked = [];

  function alreadyPicked(p) {
    return picked.some(
      (x) =>
        x === p ||
        (x.name === p.name &&
          x.surname === p.surname &&
          String(x.name).trim().toLowerCase() === String(p.name).trim().toLowerCase()),
    );
  }

  function take(key, count) {
    const out = [];
    const tryKeys = [key, ...(FORMATION_BACKFILL[key] ?? [])];
    for (const posKey of tryKeys) {
      for (const p of remaining) {
        if (out.length >= count) break;
        if (!eligible(p.rawPos, posKey)) continue;
        if (alreadyPicked(p)) continue;
        out.push(p);
        picked.push(p);
      }
      if (out.length >= count) break;
    }
    return out;
  }

  const squad = [];
  for (const key of ["GK", "DF", "MF", "FW"]) {
    const rows = take(key, need[key]);
    if (rows.length < need[key]) return null;
    for (const p of rows) {
      squad.push({
        position: POS_TR[key],
        name: p.name,
        surname: p.surname,
        [resultKey]: Math.round(Number(p[sortKey] ?? 0)),
      });
    }
  }
  return squad;
}

export function pickMostPlayedSquad(pool, need = MOST_PLAYED_NEED) {
  return pickFormationSquad(pool, { sortKey: "mp", resultKey: "caps" }, need);
}

export function pickMostGoalsSquad(pool, need = MOST_PLAYED_NEED) {
  return pickFormationSquad(pool, { sortKey: "goals", resultKey: "goals" }, need);
}

export function pickMostValuableSquad(pool, need = MOST_PLAYED_NEED) {
  return pickFormationSquad(
    pool,
    { sortKey: "valueEur", resultKey: "value_eur" },
    need,
  );
}

export function splitFullName(full) {
  const parts = String(full).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: "", surname: "" };
  if (parts.length === 1) return { name: parts[0], surname: "" };
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}
