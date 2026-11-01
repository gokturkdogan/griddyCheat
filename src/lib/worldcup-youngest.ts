import type { WorldCupYoungestPlayer } from "@/lib/types";

export function parseWorldCupYoungestPlayers(
  input: unknown,
): WorldCupYoungestPlayer[] | null {
  if (!Array.isArray(input)) return null;
  const out: WorldCupYoungestPlayer[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const p = item as Record<string, unknown>;
    const position = String(p.position ?? "").trim();
    const name = String(p.name ?? "").trim();
    const surname = String(p.surname ?? "").trim();
    const age = Number(p.age);

    if (!position || !name || !Number.isFinite(age) || age < 0) {
      return null;
    }

    out.push({
      position,
      name,
      surname,
      age: Math.round(age),
    });
  }

  if (out.length === 0) return null;
  return out;
}
