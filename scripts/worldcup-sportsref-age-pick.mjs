import { POS_TR, SQUAD_NEED } from "./worldcup-squad-pdf-shared.mjs";

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

function ageAtIso(dobIso) {
  const REF_DATE = new Date(2026, 5, 11);
  const [y, m, d] = dobIso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const birth = new Date(y, m - 1, d);
  let age = REF_DATE.getFullYear() - birth.getFullYear();
  const md = REF_DATE.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && REF_DATE.getDate() < birth.getDate())) age--;
  return age;
}

/**
 * @param {{ rawPos: string, name: string, surname: string, dob: string | null }[]} pool
 * @param {"youngest"|"oldest"} mode
 */
export function pickAgeSquadFromSportsRef(pool, mode) {
  const remaining = pool
    .filter((p) => p.dob)
    .map((p) => {
      const age = ageAtIso(p.dob);
      const [y, m, d] = p.dob.split("-").map(Number);
      const dobTime = new Date(y, m - 1, d).getTime();
      return { ...p, age, dobTime };
    })
    .filter((p) => p.age != null && Number.isFinite(p.dobTime));

  const sortDir =
    mode === "youngest"
      ? (a, b) => b.dobTime - a.dobTime
      : (a, b) => a.dobTime - b.dobTime;

  remaining.sort(sortDir);

  const picked = [];
  const need = SQUAD_NEED;

  function take(key, count) {
    const out = [];
    for (const p of remaining) {
      if (out.length >= count) break;
      if (!eligible(p.rawPos, key)) continue;
      if (picked.includes(p)) continue;
      out.push(p);
      picked.push(p);
    }
    if (out.length < count) {
      for (const p of remaining) {
        if (out.length >= count) break;
        if (picked.includes(p)) continue;
        if (key === "FW" && eligible(p.rawPos, "MF")) {
          out.push(p);
          picked.push(p);
        } else if (key === "MF" && eligible(p.rawPos, "FW")) {
          out.push(p);
          picked.push(p);
        } else if (key === "DF" && eligible(p.rawPos, "MF")) {
          out.push(p);
          picked.push(p);
        }
      }
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
        age: p.age,
      });
    }
  }
  return squad;
}
