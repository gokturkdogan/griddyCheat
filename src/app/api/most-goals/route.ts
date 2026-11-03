import { getDb } from "@/lib/db";
import type { WorldCupMostGoals } from "@/lib/types";
import { parseWorldCupMostGoalsPlayers } from "@/lib/worldcup-mostgoals";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT
        id,
        country,
        players,
        created_at::text AS created_at,
        updated_at::text AS updated_at
      FROM mostgoals
      ORDER BY country ASC
    `;
    return Response.json(rows as WorldCupMostGoals[]);
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

    const players = parseWorldCupMostGoalsPlayers(
      (body as { players?: unknown }).players,
    );
    if (!players) {
      return Response.json(
        { error: "En az bir geçerli oyuncu gerekli (name, position, goals)" },
        { status: 400 },
      );
    }

    const sql = getDb();
    const playersJson = JSON.stringify(players);

    try {
      const inserted = await sql`
        INSERT INTO mostgoals (country, players, updated_at)
        VALUES (${country}, ${playersJson}::jsonb, NOW())
        RETURNING
          id,
          country,
          players,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `;
      return Response.json(inserted[0] as WorldCupMostGoals, { status: 201 });
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (
        message.includes("mostgoals_country_unique") ||
        message.includes("duplicate key")
      ) {
        return Response.json(
          { error: "Bu ülke için zaten kayıt var" },
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
