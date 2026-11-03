import type { WorldCupMostPlayedPlayer } from "@/lib/types";

export function parseWorldCupMostPlayedPlayers(
  input: unknown,
): WorldCupMostPlayedPlayer[] | null {
  if (!Array.isArray(input)) return null;
  const out: WorldCupMostPlayedPlayer[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const p = item as Record<string, unknown>;
    const position = String(p.position ?? "").trim();
    const name = String(p.name ?? "").trim();
    const surname = String(p.surname ?? "").trim();
    const caps = Number(p.caps);

    if (!position || !name || !Number.isFinite(caps) || caps < 0) {
      return null;
    }

    out.push({
      position,
      name,
      surname,
      caps: Math.round(caps),
    });
  }

  if (out.length === 0) return null;
  return out;
}
