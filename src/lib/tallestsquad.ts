import type { TallestSquadEra, TallestSquadPlayer } from "@/lib/types";

const ERAS: TallestSquadEra[] = ["current", "all_time"];

export function parseTallestSquadEra(input: string | null): TallestSquadEra | null {
  if (!input) return null;
  const normalized = input.trim().toLowerCase().replace(/-/g, "_");
  if (normalized === "alltime") return "all_time";
  return ERAS.includes(normalized as TallestSquadEra)
    ? (normalized as TallestSquadEra)
    : null;
}

export function parseTallestSquadPlayers(input: unknown): TallestSquadPlayer[] | null {
  if (!Array.isArray(input)) return null;
  const out: TallestSquadPlayer[] = [];

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
