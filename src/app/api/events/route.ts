import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, title, date, description, location, image_url, category, raised, target, created_at
      FROM events
      ORDER BY created_at DESC
    `;

    const events = rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      date: r.date,
      description: r.description,
      location: r.location,
      imageUrl: r.image_url,
      category: r.category,
      raised: Number(r.raised) || 0,
      target: Number(r.target) || 0,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ events });
  } catch (err: any) {
    console.error("Supabase GET /api/events error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch events", events: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { title, date, description, location, imageUrl, category, raised, target } = body;

    if (!title || !date || !description) {
      return NextResponse.json({ error: "Missing required event fields" }, { status: 400 });
    }

    const id = `evt-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const finalImageUrl = imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop";

    await sql`
      INSERT INTO events (id, title, date, description, location, image_url, category, raised, target, created_at)
      VALUES (
        ${id},
        ${title},
        ${date},
        ${description},
        ${location || 'Miraj'},
        ${finalImageUrl},
        ${category || 'General'},
        ${Number(raised) || 0},
        ${Number(target) || 50000},
        ${createdAt}
      )
    `;

    const newEvent = {
      id,
      title,
      date,
      description,
      location: location || 'Miraj',
      imageUrl: finalImageUrl,
      category: category || 'General',
      raised: Number(raised) || 0,
      target: Number(target) || 50000,
      createdAt,
    };

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (err: any) {
    console.error("Supabase POST /api/events error:", err);
    return NextResponse.json({ error: err.message || "Failed to create event" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    await sql`DELETE FROM events WHERE id = ${id}`;
    return NextResponse.json({ success: true, message: `Event ${id} deleted` });
  } catch (err: any) {
    console.error("Supabase DELETE /api/events error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete event" }, { status: 500 });
  }
}
