import { getDb } from "@/lib/db";
import { parseTallestSquadEra, parseTallestSquadPlayers } from "@/lib/tallestsquad";
import type { TallestSquad } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const era = parseTallestSquadEra(searchParams.get("era"));
    if (!era) {
      return Response.json(
        { error: "Geçerli era gerekli: current veya all_time" },
        { status: 400 },
      );
    }

    const sql = getDb();
    const rows = await sql`
      SELECT
        id,
        country,
        era,
        players,
        created_at::text AS created_at,
        updated_at::text AS updated_at
      FROM tallestsquad
      WHERE era = ${era}
      ORDER BY country ASC
    `;
    return Response.json(rows as TallestSquad[]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    const country = String((body as { country?: unknown }).country ?? "").trim();
    if (!country) {
      return Response.json({ error: "Ülke gerekli" }, { status: 400 });
    }

    const era = parseTallestSquadEra(String((body as { era?: unknown }).era ?? ""));
    if (!era) {
      return Response.json(
        { error: "Geçerli era gerekli: current veya all_time" },
        { status: 400 },
      );
    }

    const players = parseTallestSquadPlayers(
      (body as { players?: unknown }).players,
    );
    if (!players) {
      return Response.json(
        { error: "En az bir geçerli oyuncu gerekli" },
        { status: 400 },
      );
    }

    const sql = getDb();
    const playersJson = JSON.stringify(players);

    try {
      const inserted = await sql`
        INSERT INTO tallestsquad (country, era, players, updated_at)
        VALUES (${country}, ${era}, ${playersJson}::jsonb, NOW())
        RETURNING
          id,
          country,
          era,
          players,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `;
      return Response.json(inserted[0] as TallestSquad, { status: 201 });
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (
        message.includes("tallestsquad_country_era_unique") ||
        message.includes("duplicate key")
      ) {
        return Response.json(
          { error: "Bu ülke ve dönem için zaten kayıt var" },
          { status: 409 },
        );
      }
      throw e;
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
