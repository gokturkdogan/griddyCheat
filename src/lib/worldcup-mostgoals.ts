import type { WorldCupMostGoalsPlayer } from "@/lib/types";

export function parseWorldCupMostGoalsPlayers(
  input: unknown,
): WorldCupMostGoalsPlayer[] | null {
  if (!Array.isArray(input)) return null;
  const out: WorldCupMostGoalsPlayer[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const p = item as Record<string, unknown>;
    const position = String(p.position ?? "").trim();
    const name = String(p.name ?? "").trim();
    const surname = String(p.surname ?? "").trim();
    const goals = Number(p.goals);

    if (!position || !name || !Number.isFinite(goals) || goals < 0) {
      return null;
    }

    out.push({
      position,
      name,
      surname,
      goals: Math.round(goals),
    });
  }

  if (out.length === 0) return null;
  return out;
}
