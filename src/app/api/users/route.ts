import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { requireAdminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const response = await clerkClient().users.getUserList({ limit: 500 });
    
    // Check if the response contains the 'data' array (Clerk v5 structure)
    const rawUsers = response.data || response;

    const users = Array.isArray(rawUsers) ? rawUsers.map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      fullName: (u.firstName || "") + (u.lastName ? " " + u.lastName : ""),
      email: u.emailAddresses?.[0]?.emailAddress || "",
      phone: u.phoneNumbers?.[0]?.phoneNumber || "",
      createdAt: new Date(u.createdAt).toISOString(),
    })) : [];

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("Clerk GET /api/users error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch users", users: [] }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID parameter" }, { status: 400 });
    }

    await clerkClient().users.deleteUser(userId);

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (err: any) {
    console.error("Clerk DELETE /api/users error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete user" }, { status: 500 });
  }
}
