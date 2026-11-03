import type { TallestCurrentPlayer } from "@/lib/types";

export function parseTallestCurrentPlayers(input: unknown): TallestCurrentPlayer[] | null {
  if (!Array.isArray(input)) return null;
  const out: TallestCurrentPlayer[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const p = item as Record<string, unknown>;
    const name = String(p.name ?? "").trim();
    const surname = String(p.surname ?? "").trim();
    const position = String(p.position ?? "").trim();
    const height_cm = Number(p.height_cm);

    if (!name || !position || !Number.isFinite(height_cm) || height_cm <= 0) {
      return null;
    }

    out.push({
      name,
      surname,
      position,
      height_cm: Math.round(height_cm),
    });
  }

  if (out.length === 0) return null;
  return out;
}
