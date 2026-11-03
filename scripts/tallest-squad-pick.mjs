export const SQUAD_NEED = { GK: 2, DF: 4, MF: 4, FW: 4 };

export const POS_TR = {
  GK: "Kaleci",
  DF: "Defans",
  MF: "Orta saha",
  FW: "Forvet",
};

/** En uzun 2 GK · 4 DF · 4 MF · 4 FW */
export function pickTallestSquad(roster) {
  const byPos = { GK: [], DF: [], MF: [], FW: [] };
  for (const p of roster) {
    if (byPos[p.posKey]) byPos[p.posKey].push(p);
  }

  for (const k of Object.keys(byPos)) {
    byPos[k].sort((a, b) => b.height_cm - a.height_cm);
  }

  for (const pos of Object.keys(SQUAD_NEED)) {
    if (byPos[pos].length < SQUAD_NEED[pos]) {
      return null;
    }
  }

  return [
    ...byPos.GK.slice(0, SQUAD_NEED.GK),
    ...byPos.DF.slice(0, SQUAD_NEED.DF),
    ...byPos.MF.slice(0, SQUAD_NEED.MF),
    ...byPos.FW.slice(0, SQUAD_NEED.FW),
  ].map((p) => ({
    name: p.name,
    surname: p.surname,
    position: POS_TR[p.posKey],
    height_cm: p.height_cm,
  }));
}

export function splitPlayerName(full) {
  const parts = String(full).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: "", surname: "" };
  if (parts.length === 1) return { name: parts[0], surname: "" };
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}
