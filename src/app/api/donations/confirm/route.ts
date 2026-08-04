import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/supabase";
import { sendDonationReceipt } from "@/lib/email";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentId, donorName, email, phone, pan, amount } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json({ error: "Missing orderId or paymentId" }, { status: 400 });
    }

    await sql`
      UPDATE donations
      SET status = 'Paid', payment_id = ${paymentId}
      WHERE order_id = ${orderId}
    `;

    return NextResponse.json({
      success: true,
      message: "Donation marked as Paid in Supabase.",
    });
  } catch (err: any) {
    console.error("Donations confirm error:", err);
    return NextResponse.json({ error: err.message || "Confirmation failed" }, { status: 500 });
  }
}
