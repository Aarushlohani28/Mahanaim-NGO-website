import { NextRequest, NextResponse } from "next/server";

/**
 * Validates that the incoming request carries a valid admin secret token.
 * The token must be sent in the Authorization header as:
 *   Authorization: Bearer <ADMIN_SECRET_TOKEN>
 *
 * Returns null if the request is authorized, or a 401/403 NextResponse if not.
 */
export function requireAdminAuth(req: NextRequest): NextResponse | null {
  const adminSecret = process.env.ADMIN_SECRET_TOKEN;

  // If the env var is not configured at all, block all write operations
  if (!adminSecret) {
    console.error("[AdminAuth] ADMIN_SECRET_TOKEN is not configured in environment variables.");
    return NextResponse.json(
      { error: "Server misconfiguration: admin auth not configured." },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized: missing token." }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (token !== adminSecret) {
    return NextResponse.json({ error: "Forbidden: invalid admin token." }, { status: 403 });
  }

  return null; // Authorized
}
