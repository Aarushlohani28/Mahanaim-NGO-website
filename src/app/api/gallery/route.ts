import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/adminAuth";

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, image_url, hover_description, created_at
      FROM gallery
      ORDER BY created_at DESC
    `;

    const gallery = rows.map((r: any) => ({
      id: r.id,
      imageURL: r.image_url,
      hoverDescription: r.hover_description,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ gallery });
  } catch (err: any) {
    console.error("Supabase GET /api/gallery error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch gallery", gallery: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { imageURL, hoverDescription } = body;

    if (!imageURL) {
      return NextResponse.json({ error: "Missing imageURL" }, { status: 400 });
    }

    const id = `gal-${Date.now()}`;
    const createdAt = new Date().toISOString();

    await sql`
      INSERT INTO gallery (id, image_url, hover_description, created_at)
      VALUES (
        ${id},
        ${imageURL},
        ${hoverDescription || ''},
        ${createdAt}
      )
    `;

    const newGalleryItem = {
      id,
      imageURL,
      hoverDescription: hoverDescription || '',
      createdAt,
    };

    return NextResponse.json({ item: newGalleryItem }, { status: 201 });
  } catch (err: any) {
    console.error("Supabase POST /api/gallery error:", err);
    return NextResponse.json({ error: err.message || "Failed to create gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing gallery item id" }, { status: 400 });
    }

    await sql`DELETE FROM gallery WHERE id = ${id}`;
    return NextResponse.json({ success: true, message: `Gallery item ${id} deleted` });
  } catch (err: any) {
    console.error("Supabase DELETE /api/gallery error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete gallery item" }, { status: 500 });
  }
}
