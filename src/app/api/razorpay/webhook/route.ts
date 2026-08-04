import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateDonationStatusByOrderId } from "@/lib/dataStore";

export async function POST(req: NextRequest) {
  try {
      const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Webhook] RAZORPAY_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 503 });
    }

    // Signature is MANDATORY — reject any request that omits it
    if (!signature) {
      console.warn("[Webhook] Rejected: missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("[Webhook] Rejected: invalid HMAC signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured" || payload.event === "payment.captured") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        // Automatically update Supabase database status to Paid
        let updated = false;
        try {
          const { sql } = await import("@/lib/supabase");
          const result = await sql`
            UPDATE donations
            SET status = 'Paid', payment_id = ${paymentId || `pay_${Date.now()}`}
            WHERE order_id = ${orderId}
          `;
          if (result.count > 0) updated = true;
        } catch (dbErr) {
          console.warn("Supabase webhook update error:", dbErr);
        }
        await updateDonationStatusByOrderId(orderId, paymentId || `pay_${Date.now()}`, "Paid");

        // Send Email Receipt using Razorpay payment entity notes / donor details
        let receiptSent = false;
        try {
          const { sendDonationReceipt } = await import("@/lib/email");
          const notes = paymentEntity?.notes || {};
          const recipientEmail = notes.email || paymentEntity?.email;
          const donorName = notes.donorName || "Valued Donor";
          const amount = paymentEntity?.amount ? Number(paymentEntity.amount) / 100 : 0;
          const pan = notes.pan || "N/A";
          const phone = notes.phone || paymentEntity?.contact || "";

          if (recipientEmail) {
            const res = await sendDonationReceipt({
              donorEmail: recipientEmail,
              donorName,
              amount,
              orderId,
              paymentId: paymentId || `pay_${Date.now()}`,
              pan,
              phone,
            });
            receiptSent = res.success;
          }
        } catch (emailErr) {
          console.warn("Webhook email receipt error:", emailErr);
        }
        
        return NextResponse.json({
          success: true,
          received: true,
          message: `Donation order ${orderId} marked as Paid in Supabase automatically.`,
          updated,
          receiptSent,
        });
      }
    }

    return NextResponse.json({ received: true, event });
  } catch (error: any) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
