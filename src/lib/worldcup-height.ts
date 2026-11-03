import type { WorldCupHeightPlayer } from "@/lib/types";

export function parseWorldCupHeightPlayers(
  input: unknown,
): WorldCupHeightPlayer[] | null {
  if (!Array.isArray(input)) return null;
  const out: WorldCupHeightPlayer[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const p = item as Record<string, unknown>;
    const position = String(p.position ?? "").trim();
    const name = String(p.name ?? "").trim();
    const surname = String(p.surname ?? "").trim();
    const height_cm = Number(p.height_cm);

    if (!position || !name || !Number.isFinite(height_cm) || height_cm <= 0) {
      return null;
    }

    out.push({
      position,
      name,
      surname,
      height_cm: Math.round(height_cm),
    });
  }

  if (out.length === 0) return null;
  return out;
}
