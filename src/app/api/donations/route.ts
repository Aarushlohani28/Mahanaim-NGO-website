import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const rows = await sql`
      SELECT id, user_id, amount, order_id, payment_id, status, created_at
      FROM donations
      ORDER BY created_at DESC
    `;

    const donations = rows.map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      amount: Number(r.amount) || 0,
      orderId: r.order_id,
      paymentId: r.payment_id,
      status: r.status as "pending" | "Paid" | "failed",
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ donations });
  } catch (err: any) {
    console.error("Supabase GET /api/donations error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch donations", donations: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, orderId } = body;

    if (!userId || !amount || !orderId) {
      return NextResponse.json({ error: "Missing required donation fields" }, { status: 400 });
    }

    const id = `don-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const status = "pending";

    await sql`
      INSERT INTO donations (id, user_id, amount, order_id, status, created_at)
      VALUES (
        ${id},
        ${userId},
        ${Number(amount)},
        ${orderId},
        ${status},
        ${createdAt}
      )
    `;

    const newDonation = {
      id,
      userId,
      amount: Number(amount),
      orderId,
      status,
      createdAt,
    };

    return NextResponse.json({ donation: newDonation }, { status: 201 });
  } catch (err: any) {
    console.error("Supabase POST /api/donations error:", err);
    return NextResponse.json({ error: err.message || "Failed to create donation" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing donation ID parameter" }, { status: 400 });
    }

    await sql`
      DELETE FROM donations
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Donation record deleted successfully." });
  } catch (err: any) {
    console.error("DELETE /api/donations error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete donation" }, { status: 500 });
  }
}
