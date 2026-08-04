import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/adminAuth";

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, title, description, goal_amount, raised_amount, image_url, created_at
      FROM causes
      ORDER BY created_at DESC
    `;

    const causes = rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      goalAmount: Number(r.goal_amount) || 0,
      raisedAmount: Number(r.raised_amount) || 0,
      imageURL: r.image_url,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ causes });
  } catch (err: any) {
    console.error("Supabase GET /api/causes error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch causes", causes: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { title, description, goalAmount, raisedAmount, imageURL } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
    }

    const id = `cause-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const finalImageURL = imageURL || "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop";

    await sql`
      INSERT INTO causes (id, title, description, goal_amount, raised_amount, image_url, created_at)
      VALUES (
        ${id},
        ${title},
        ${description},
        ${Number(goalAmount) || 50000},
        ${Number(raisedAmount) || 0},
        ${finalImageURL},
        ${createdAt}
      )
    `;

    const newCause = {
      id,
      title,
      description,
      goalAmount: Number(goalAmount) || 50000,
      raisedAmount: Number(raisedAmount) || 0,
      imageURL: finalImageURL,
      createdAt,
    };

    return NextResponse.json({ cause: newCause }, { status: 201 });
  } catch (err: any) {
    console.error("Supabase POST /api/causes error:", err);
    return NextResponse.json({ error: err.message || "Failed to create cause" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing cause id" }, { status: 400 });
    }

    await sql`DELETE FROM causes WHERE id = ${id}`;
    return NextResponse.json({ success: true, message: `Cause ${id} deleted` });
  } catch (err: any) {
    console.error("Supabase DELETE /api/causes error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete cause" }, { status: 500 });
  }
}
