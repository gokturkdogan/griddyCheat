import { getDb } from "@/lib/db";
import type { Cheat } from "@/lib/types";
import { storeImage, validateImageFile } from "@/lib/upload-image";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, title, image_url, created_at::text AS created_at
      FROM lastseven
      ORDER BY created_at DESC
    `;
    return Response.json(rows as Cheat[]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    const file = form.get("image");

    if (!title) {
      return Response.json({ error: "Title gerekli" }, { status: 400 });
    }

    let imageUrl = String(form.get("imageUrl") ?? "").trim();

    if (file instanceof File && file.size > 0) {
      const validationError = validateImageFile(file);
      if (validationError) {
        return Response.json({ error: validationError }, { status: 400 });
      }
      imageUrl = await storeImage(file);
    }

    if (!imageUrl) {
      return Response.json(
        { error: "Görsel dosyası veya URL gerekli" },
        { status: 400 },
      );
    }

    const sql = getDb();
    const inserted = await sql`
      INSERT INTO lastseven (title, image_url)
      VALUES (${title}, ${imageUrl})
      RETURNING id, title, image_url, created_at::text AS created_at
    `;

    const row = inserted[0] as Cheat;
    return Response.json(row, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
