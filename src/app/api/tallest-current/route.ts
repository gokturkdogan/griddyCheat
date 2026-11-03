import { getDb } from "@/lib/db";
import { parseTallestCurrentPlayers } from "@/lib/tallest-current";
import type { TallestCurrent } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT
        id,
        team,
        players,
        created_at::text AS created_at,
        updated_at::text AS updated_at
      FROM tallest_current
      ORDER BY team ASC
    `;
    return Response.json(rows as TallestCurrent[]);
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

    const team = String((body as { team?: unknown }).team ?? "").trim();
    if (!team) {
      return Response.json({ error: "Takım adı gerekli" }, { status: 400 });
    }

    const players = parseTallestCurrentPlayers(
      (body as { players?: unknown }).players,
    );
    if (!players) {
      return Response.json(
        { error: "En az bir geçerli oyuncu gerekli (name, position, height_cm)" },
        { status: 400 },
      );
    }

    const sql = getDb();
    const playersJson = JSON.stringify(players);

    try {
      const inserted = await sql`
        INSERT INTO tallest_current (team, players, updated_at)
        VALUES (${team}, ${playersJson}::jsonb, NOW())
        RETURNING
          id,
          team,
          players,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `;
      return Response.json(inserted[0] as TallestCurrent, { status: 201 });
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (
        message.includes("tallest_current_team_unique") ||
        message.includes("duplicate key")
      ) {
        return Response.json(
          { error: "Bu takım için zaten kayıt var" },
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
