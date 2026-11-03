import { getDb } from "@/lib/db";
import type { WorldCupTallest } from "@/lib/types";
import { parseWorldCupHeightPlayers } from "@/lib/worldcup-height";

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
      FROM worldcuptallest
      ORDER BY country ASC
    `;
    return Response.json(rows as WorldCupTallest[]);
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

    const players = parseWorldCupHeightPlayers(
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
        INSERT INTO worldcuptallest (country, players, updated_at)
        VALUES (${country}, ${playersJson}::jsonb, NOW())
        RETURNING
          id,
          country,
          players,
          created_at::text AS created_at,
          updated_at::text AS updated_at
      `;
      return Response.json(inserted[0] as WorldCupTallest, { status: 201 });
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (
        message.includes("worldcuptallest_country_unique") ||
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
