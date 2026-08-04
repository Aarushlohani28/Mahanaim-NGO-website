import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/supabase";
import { clerkClient } from "@clerk/nextjs/server";
import { sendDonationReceipt } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentId, email, donorName, phone, pan, amount } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    let finalEmail = email;
    let finalName = donorName || "Valued Donor";
    let finalAmount = amount;
    let finalPaymentId = paymentId;
    let finalPan = pan || "N/A";
    let finalPhone = phone || "N/A";
    let createdAtDate: string | undefined;

    // Fetch donation record details from Supabase if available
    try {
      const rows = await sql`
        SELECT user_id, amount, payment_id, created_at
        FROM donations
        WHERE order_id = ${orderId}
        LIMIT 1
      `;
      if (rows && rows.length > 0) {
        if (!finalAmount) finalAmount = Number(rows[0].amount);
        if (!finalPaymentId) finalPaymentId = rows[0].payment_id;
        if (rows[0].created_at) {
          createdAtDate = new Date(rows[0].created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }

        if (!finalEmail && rows[0].user_id) {
          const user = await clerkClient().users.getUser(rows[0].user_id);
          finalEmail = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
          finalName = user.fullName || user.firstName || finalName;
          finalPhone = user.primaryPhoneNumber?.phoneNumber || user.phoneNumbers?.[0]?.phoneNumber || finalPhone;
          if (user.publicMetadata?.pan && typeof user.publicMetadata.pan === "string") {
            finalPan = user.publicMetadata.pan;
          }
        }
      }
    } catch (dbErr) {
      console.warn("DB lookup error in send-email route:", dbErr);
    }

    if (!finalEmail) {
      return NextResponse.json({ error: "Donor email address not found" }, { status: 400 });
    }

    const emailResult = await sendDonationReceipt({
      donorEmail: finalEmail,
      donorName: finalName,
      amount: finalAmount || 1000,
      orderId,
      paymentId: finalPaymentId || `pay_${Date.now()}`,
      date: createdAtDate,
      pan: finalPan,
      phone: finalPhone,
    });

    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.error || "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Receipt sent to ${finalEmail} successfully!`,
    });
  } catch (err: any) {
    console.error("POST /api/donations/send-email error:", err);
    return NextResponse.json({ error: err.message || "Failed to send email receipt" }, { status: 500 });
  }
}
