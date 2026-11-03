import type { WorldCupMostValuablePlayer } from "@/lib/types";

export function parseWorldCupMostValuablePlayers(
  input: unknown,
): WorldCupMostValuablePlayer[] | null {
  if (!Array.isArray(input)) return null;
  const out: WorldCupMostValuablePlayer[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const p = item as Record<string, unknown>;
    const position = String(p.position ?? "").trim();
    const name = String(p.name ?? "").trim();
    const surname = String(p.surname ?? "").trim();
    const value_eur = Number(p.value_eur);

    if (!position || !name || !Number.isFinite(value_eur) || value_eur < 0) {
      return null;
    }

    out.push({
      position,
      name,
      surname,
      value_eur: Math.round(value_eur),
    });
  }

  if (out.length === 0) return null;
  return out;
}
