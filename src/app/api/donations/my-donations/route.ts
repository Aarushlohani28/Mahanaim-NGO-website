import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: User not signed in" }, { status: 401 });
    }

    const rows = await sql`
      SELECT id, user_id, amount, order_id, payment_id, status, created_at
      FROM donations
      WHERE user_id = ${userId}
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
    console.error("GET /api/donations/my-donations error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch user donations", donations: [] },
      { status: 500 }
    );
  }
}
