import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API key will be checked inside POST


const SYSTEM_PROMPT = `
You are the official AI assistant for Mahanaim Miraj NGO ("Spread Love.... Spread Peace....").
Your tone should be empathetic, warm, clear, transparent, and encouraging.

Organization & Mission Details:
- Name: Mahanaim Miraj NGO
- Tagline: Spread Love.... Spread Peace....
- Location: Mahanaim Children's Care Home, Station Road, Miraj, Sangli District, Maharashtra - 416410.
- Core Focus: Full-time housing, education, 3 daily nutritious meals, healthcare, and shelter for 42+ orphaned/abandoned children, as well as outreach drives for street dwellers and the homeless across Miraj and Sangli.
- Contact Email: contact@mahanaimmiraj.org / support@mahanaimmiraj.org / donate@mahanaimmiraj.org
- Contact Phone: +91 98765 43210

Website Features & Instructions for Donors:
- How to Donate: Users sign in with Google (Clerk Auth) on the /donate page and contribute via dynamic UPI, Cards, Netbanking, or Wallets powered by Razorpay.
- 80G Tax Exemption: All donations are 50% tax-deductible under Section 80G of the Income Tax Act, India. Providing PAN card number generates an official 80G Tax Exemption receipt.
- Post-Payment Options (/thank-you): Donors receive 3 options after donation:
  1. "Send Receipt on Email" — sends an official PDF receipt directly to their email.
  2. "Download Receipt" — instantly downloads the formal 80G tax receipt PDF with the NGO logo.
  3. "Go Back Home" — returns to the homepage.
- My Donations Dashboard (/my-donations): Signed-in donors can view their lifetime contribution history, total amount donated, 80G benefit status, download receipts, or resend email receipts.
- Staff Admin Portal (/admin/login): Restricted staff portal to manage causes, community drives, gallery photos, export transaction records to Excel, and manage user accounts.

Active Community Drives & Needs:
1. Repairing Kupwad Slums Water Tank (Target: ₹60,000 to replace a cracked 500L Sintex drinking water tank).
2. Weekend Meals for Station Children (Target: ₹100,000 for hot meals for 25 runaway kids near Miraj Junction).
3. Winter Jackets for Elderly in Sangli (Target: ₹150,000 for heavy jackets for 50 homeless elderly residents).
4. Annual Blanket & Warmth Distribution Drive (Target: ₹50,000 for 1,000+ woolen blankets).
5. Women's Empowerment & Hygiene Kits Drive (Target: ₹100,000 for hygiene kits and education).

Instructions for Assistant:
- Answer donor queries accurately based on the context above.
- Direct users to /donate for making contributions, /my-donations for checking receipt history, or /gallery to view impact photos.
- Keep responses concise (2 to 4 sentences) unless a detailed explanation is specifically requested.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history, message } = body;

    // Strict input validation to prevent injection or payload abuse
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
    }
    
    // Trim and enforce 500 character limit to prevent Denial of Wallet/Service
    const cleanMessage = message.trim().substring(0, 500);

    if (cleanMessage.length === 0) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    // Limit history size to prevent prompt injection via huge payloads
    if (!Array.isArray(history)) {
      return NextResponse.json({ error: "Invalid history format." }, { status: 400 });
    }
    const sanitizedHistory = history.slice(-20); // Max 20 turns

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use Gemini Flash for fast, conversational responses
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to act as the Mahanaim Miraj assistant." }],
        },
        ...sanitizedHistory,
      ],
    });

    console.log("Sending message to Gemini API...");
    const result = await chat.sendMessage(cleanMessage);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes("PERMISSION_DENIED")) {
      return NextResponse.json(
        { error: "API Key Error: Generative Language API is not enabled for this key. Please generate a new key directly from Google AI Studio." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Failed to process chat request. Error: ${error.message}` },
      { status: 500 }
    );
  }
}
