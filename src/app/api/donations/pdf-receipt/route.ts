import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/supabase";
import { clerkClient } from "@clerk/nextjs/server";
import { generateReceiptPDFBuffer } from "@/lib/pdfGenerator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const paymentIdParam = searchParams.get("paymentId");

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId parameter" }, { status: 400 });
    }

    // Fetch donation record from Supabase
    const rows = await sql`
      SELECT id, user_id, amount, order_id, payment_id, status, created_at
      FROM donations
      WHERE order_id = ${orderId}
      LIMIT 1
    `;

    const donation = rows[0];
    let donorName = "Valued Donor";
    let donorEmail = "donor@mahanaimmiraj.org";
    let donorPhone = "N/A";
    let pan = "N/A";
    let amount = donation?.amount ? Number(donation.amount) : 1000;
    let paymentId = donation?.payment_id || paymentIdParam || `pay_${Date.now()}`;
    let date = donation?.created_at
      ? new Date(donation.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

    if (donation?.user_id) {
      try {
        const user = await clerkClient().users.getUser(donation.user_id);
        donorName = user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Valued Donor");
        donorEmail = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || donorEmail;
        donorPhone = user.primaryPhoneNumber?.phoneNumber || user.phoneNumbers?.[0]?.phoneNumber || "N/A";
        if (user.publicMetadata?.pan && typeof user.publicMetadata.pan === "string") {
          pan = user.publicMetadata.pan;
        }
      } catch (clerkErr) {
        console.warn("Clerk user fetch error in pdf-receipt:", clerkErr);
      }
    }

    const pdfBuffer = await generateReceiptPDFBuffer({
      donorName,
      donorEmail,
      donorPhone,
      pan,
      amount,
      date,
      orderId,
      paymentId,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="80G_Receipt_${orderId}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("PDF Receipt generation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate PDF receipt" },
      { status: 500 }
    );
  }
}
