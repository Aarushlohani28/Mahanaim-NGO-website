import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReceiptPDF, ReceiptPDFProps } from "@/components/ReceiptPDF";

/**
 * Server-side utility that takes donor & donation details,
 * renders the ReceiptPDF component into a Node.js Buffer,
 * which can be attached to an email (e.g. Resend or Nodemailer).
 */
export async function generateReceiptPDFBuffer(data: ReceiptPDFProps): Promise<Buffer> {
  try {
    const pdfElement = React.createElement(ReceiptPDF, data);
    // renderToBuffer renders the React PDF element into a Node Buffer
    const buffer = await renderToBuffer(pdfElement as any);
    return buffer;
  } catch (error) {
    console.error("[PDF Generator] Error rendering PDF buffer:", error);
    throw new Error(`PDF Generation Failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
