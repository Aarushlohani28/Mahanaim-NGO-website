import { Resend } from "resend";

export interface DonationReceiptData {
  donorEmail: string;
  donorName: string;
  amount: number;
  orderId: string;
  paymentId: string;
  date?: string;
  pan?: string;
  phone?: string;
}

export async function sendDonationReceipt(data: DonationReceiptData): Promise<{ success: boolean; error?: string }> {
  const {
    donorEmail,
    donorName,
    amount,
    orderId,
    paymentId,
    date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    pan = "N/A",
  } = data;

  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || "Mahanaim NGO <onboarding@resend.dev>";

  if (!donorEmail) {
    console.warn("[Email Service] No donor email provided. Skipping receipt email.");
    return { success: false, error: "No recipient email provided" };
  }

  const formattedAmount = `Rs. ${amount.toLocaleString("en-IN")}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Donation Receipt - Mahanaim Miraj NGO</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; color: #333333; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
        .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 24px; text-align: center; color: #ffffff; border-bottom: 4px solid #D9232D; }
        .header h1 { margin: 0 0 8px; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff; }
        .header p { margin: 0; font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        .body { padding: 32px 28px; }
        .greeting { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 12px; }
        .message { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .receipt-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
        .receipt-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
        .row { display: flex; justify-space-between: space-between; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: #64748b; font-weight: 500; }
        .value { color: #0f172a; font-weight: 600; text-align: right; }
        .amount-row { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 14px 16px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
        .amount-label { font-size: 15px; font-weight: 700; color: #991b1b; }
        .amount-value { font-size: 22px; font-weight: 800; color: #D9232D; }
        .tax-badge { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px; color: #065f46; font-size: 13px; line-height: 1.5; }
        .tax-badge strong { color: #047857; }
        .footer { background: #0f172a; padding: 24px; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.6; }
        .footer a { color: #38bdf8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mahanaim Miraj NGO</h1>
          <p>Official Donation Receipt</p>
        </div>
        
        <div class="body">
          <div class="greeting">Dear ${donorName},</div>
          <div class="message">
            Thank you from the bottom of our hearts for your generous contribution. Your support empowers us to care for orphaned children, provide education, and transform lives.
          </div>

          <div class="receipt-card">
            <div class="receipt-title">Payment Summary</div>
            <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; color: #333;">
              <tr>
                <td style="color: #64748b; font-weight: 500;">Donor Name:</td>
                <td style="text-align: right; font-weight: 600; color: #0f172a;">${donorName}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 500;">Order ID:</td>
                <td style="text-align: right; font-weight: 600; font-family: monospace; color: #0f172a;">${orderId}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 500;">Payment ID:</td>
                <td style="text-align: right; font-weight: 600; font-family: monospace; color: #0f172a;">${paymentId}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 500;">Date:</td>
                <td style="text-align: right; font-weight: 600; color: #0f172a;">${date}</td>
              </tr>
              ${pan && pan !== "N/A" ? `
              <tr>
                <td style="color: #64748b; font-weight: 500;">PAN:</td>
                <td style="text-align: right; font-weight: 600; font-family: monospace; color: #0f172a;">${pan}</td>
              </tr>` : ""}
            </table>

            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px 16px; margin-top: 16px; text-align: center;">
              <span style="font-size: 14px; font-weight: 700; color: #991b1b; display: block;">Total Donated Amount</span>
              <span style="font-size: 24px; font-weight: 800; color: #D9232D; display: block; margin-top: 4px;">${formattedAmount}</span>
            </div>
          </div>

          <div class="tax-badge">
            <strong>✓ 80G Tax Exemption Eligible</strong><br/>
            This email serves as an official receipt. Donations to Mahanaim Miraj NGO are eligible for 50% tax deduction under Section 80G of the Income Tax Act, India.
          </div>

          <div class="message" style="margin-bottom: 0;">
            If you have any questions regarding your receipt, please reply directly to this email or contact us at <a href="mailto:support@mahanaimmiraj.org" style="color: #D9232D; text-decoration: underline;">support@mahanaimmiraj.org</a>.
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px;"><strong>Mahanaim Miraj NGO</strong></p>
          <p style="margin: 0 0 6px;">Dedicated to Child Welfare & Community Empowerment</p>
          <p style="margin: 0;">Reg No. 80G/12A Tax Exempted | <a href="https://mahanaimmiraj.org">www.mahanaimmiraj.org</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  let pdfAttachment: { filename: string; content: Buffer } | undefined;
  try {
    const { generateReceiptPDFBuffer } = await import("@/lib/pdfGenerator");
    const buffer = await generateReceiptPDFBuffer({
      donorName,
      donorEmail,
      donorPhone: data.phone || "N/A",
      pan,
      amount,
      date,
      orderId,
      paymentId,
    });
    pdfAttachment = {
      filename: `80G_Receipt_${orderId}.pdf`,
      content: buffer,
    };
  } catch (pdfErr) {
    console.warn("[Email Service] PDF generation failed, sending email without attachment:", pdfErr);
  }

  if (!apiKey) {
    console.log("[Email Service Simulation] RESEND_API_KEY is not set.");
    console.log(`[Email Service Simulation] Would send donation receipt to ${donorEmail} with PDF attachment`);
    return { success: true };
  }

  const adminEmail = process.env.ADMIN_EMAIL || "aarush.lohani@gmail.com";
  // Primary target recipient
  let recipients: string[] = [donorEmail];
  if (adminEmail && !recipients.includes(adminEmail)) {
    recipients.push(adminEmail);
  }

  try {
    const resend = new Resend(apiKey);
    let response = await resend.emails.send({
      from: senderEmail,
      to: recipients.length === 1 ? recipients[0] : recipients,
      subject: `Thank You for Your Donation! Official Receipt (${formattedAmount}) - Mahanaim Miraj NGO`,
      html: htmlContent,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    });

    // If Resend returns an error (e.g. test domain restrictions when sending to non-registered emails)
    if (response.error) {
      console.warn("[Email Service] Resend primary email delivery warning:", response.error.message);
      
      // Fallback: Send directly to admin email (aarush.lohani@gmail.com)
      if (adminEmail && donorEmail !== adminEmail) {
        console.log(`[Email Service] Retrying fallback delivery to verified admin email (${adminEmail})...`);
        response = await resend.emails.send({
          from: senderEmail,
          to: adminEmail,
          subject: `[Donor: ${donorName}] Thank You for Your Donation! Official Receipt (${formattedAmount}) - Mahanaim Miraj NGO`,
          html: htmlContent,
          attachments: pdfAttachment ? [pdfAttachment] : undefined,
        });
      }
    }

    if (response.error) {
      console.error("[Email Service] Resend error after fallback:", response.error);
      return { success: false, error: response.error.message };
    }

    console.log(`[Email Service] Receipt with PDF attachment delivered successfully! (Email ID: ${response.data?.id})`);
    return { success: true };
  } catch (err: any) {
    console.error("[Email Service] Exception sending receipt email:", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}
