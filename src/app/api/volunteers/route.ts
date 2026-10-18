import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export interface VolunteerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  availableDays: string[];
  availabilityTime: string;
  areasOfInterest: string[];
  skills: string;
  occupation: string;
  message: string;
  status: "PENDING" | "CONTACTED" | "APPROVED" | "REJECTED" | "INACTIVE";
  adminNotes: string;
  consentToContact: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fallback in-memory store if database is offline/unreachable
const globalForVolunteers = globalThis as unknown as {
  _localVolunteersStore: VolunteerRecord[] | undefined;
};

const initialStore: VolunteerRecord[] = [
  {
    id: "vol-1",
    name: "Dr. Ananya Joshi",
    phone: "+91 98220 12345",
    email: "ananya.joshi@example.com",
    address: "Kupwad Road, Sangli, Maharashtra - 416416",
    availableDays: ["Saturday", "Sunday"],
    availabilityTime: "Morning",
    areasOfInterest: ["Healthcare", "Distribution/Relief"],
    skills: "Pediatric health, First Aid, Medical triage",
    occupation: "Pediatrician",
    message: "Would love to assist with weekend medical checkups for residential children.",
    status: "APPROVED",
    adminNotes: "Verified medical credentials. Scheduled for Sunday clinic.",
    consentToContact: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "vol-2",
    name: "Rohan Kulkarni",
    phone: "+91 97654 67890",
    email: "rohan.kulkarni@example.com",
    address: "Station Road, Miraj, Maharashtra - 416410",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availabilityTime: "Evening",
    areasOfInterest: ["Education", "Social Media/Content"],
    skills: "Math tutoring, English, Digital marketing",
    occupation: "High School Teacher",
    message: "Interested in tutoring math and science for grades 6 to 10.",
    status: "PENDING",
    adminNotes: "Need to call for weekday schedule verification.",
    consentToContact: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "vol-3",
    name: "Sneha Patil",
    phone: "+91 94224 55512",
    email: "sneha.patil@example.com",
    address: "Market Yard, Sangli, Maharashtra - 416415",
    availableDays: ["Saturday", "Sunday"],
    availabilityTime: "Flexible",
    areasOfInterest: ["Food/Nutrition", "Event Support", "Distribution/Relief"],
    skills: "Event coordination, Logistics, Cooking support",
    occupation: "College Student",
    message: "Volunteered in past blanket drives. Ready to assist in community kitchen.",
    status: "CONTACTED",
    adminNotes: "Called on Tuesday. Available for next winter blanket distribution drive.",
    consentToContact: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const localVolunteersStore = globalForVolunteers._localVolunteersStore ?? initialStore;
// Always persist to globalThis so store survives HMR reloads in dev
globalForVolunteers._localVolunteersStore = localVolunteersStore;


/**
 * GET /api/volunteers
 * ADMIN ONLY — Protected with requireAdminAuth
 */
export async function GET(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const status = (searchParams.get("status") || "All").trim();
  const day = (searchParams.get("day") || "All").trim();
  const interest = (searchParams.get("interest") || "All").trim();
  const id = searchParams.get("id");

  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS volunteers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        address TEXT NOT NULL,
        available_days JSONB DEFAULT '[]'::jsonb,
        availability_time TEXT DEFAULT 'Flexible',
        areas_of_interest JSONB DEFAULT '[]'::jsonb,
        skills TEXT,
        occupation TEXT,
        message TEXT,
        status TEXT DEFAULT 'PENDING',
        admin_notes TEXT,
        consent_to_contact BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `.catch(() => {});

    let rows;
    if (id) {
      rows = await sql`SELECT * FROM volunteers WHERE id = ${id}`;
    } else {
      rows = await sql`SELECT * FROM volunteers ORDER BY created_at DESC`;
    }

    let volunteers: VolunteerRecord[] = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email || "",
      address: r.address,
      availableDays: Array.isArray(r.available_days)
        ? r.available_days
        : typeof r.available_days === "string"
        ? JSON.parse(r.available_days || "[]")
        : [],
      availabilityTime: r.availability_time || "Flexible",
      areasOfInterest: Array.isArray(r.areas_of_interest)
        ? r.areas_of_interest
        : typeof r.areas_of_interest === "string"
        ? JSON.parse(r.areas_of_interest || "[]")
        : [],
      skills: r.skills || "",
      occupation: r.occupation || "",
      message: r.message || "",
      status: r.status as any,
      adminNotes: r.admin_notes || "",
      consentToContact: Boolean(r.consent_to_contact),
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    }));

    // Merge DB results with any in-memory-only entries (e.g. when DB insert failed)
    const dbIds = new Set(volunteers.map((v) => v.id));
    const localOnlyEntries = localVolunteersStore.filter((v) => !dbIds.has(v.id));
    if (localOnlyEntries.length > 0) {
      volunteers = [...localOnlyEntries, ...volunteers];
    }
    // Keep local store in sync with what DB returned
    if (volunteers.length > 0) {
      localVolunteersStore.length = 0;
      localVolunteersStore.push(...volunteers);
    }

    // Apply filters
    let filtered = volunteers;
    if (search) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(search) ||
          v.phone.toLowerCase().includes(search) ||
          v.email.toLowerCase().includes(search)
      );
    }
    if (status && status !== "All") {
      filtered = filtered.filter((v) => v.status === status);
    }
    if (day && day !== "All") {
      filtered = filtered.filter((v) => v.availableDays.includes(day));
    }
    if (interest && interest !== "All") {
      filtered = filtered.filter((v) => v.areasOfInterest.includes(interest));
    }

    return NextResponse.json({ volunteers: filtered });
  } catch (err: any) {
    console.warn("Supabase GET /api/volunteers error, using memory fallback:", err);

    let filtered = localVolunteersStore;
    if (id) {
      filtered = filtered.filter((v) => v.id === id);
    }
    if (search) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(search) ||
          v.phone.toLowerCase().includes(search) ||
          v.email.toLowerCase().includes(search)
      );
    }
    if (status && status !== "All") {
      filtered = filtered.filter((v) => v.status === status);
    }
    if (day && day !== "All") {
      filtered = filtered.filter((v) => v.availableDays.includes(day));
    }
    if (interest && interest !== "All") {
      filtered = filtered.filter((v) => v.areasOfInterest.includes(interest));
    }

    return NextResponse.json({ volunteers: filtered });
  }
}

/**
 * POST /api/volunteers
 * PUBLIC ENDPOINT — Volunteer Registration Submission
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      address,
      availableDays,
      availabilityTime,
      areasOfInterest,
      skills,
      occupation,
      message,
      consentToContact,
    } = body;

    // --- Validation ---
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Validation Error: Full name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || "").toString().replace(/[^0-9+]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Validation Error: A valid 10-digit phone number is required." },
        { status: 400 }
      );
    }

    if (!address || typeof address !== "string" || address.trim().length < 5) {
      return NextResponse.json(
        { error: "Validation Error: Address/Location is required (minimum 5 characters)." },
        { status: 400 }
      );
    }

    const cleanDays = Array.isArray(availableDays) ? availableDays : [];
    if (cleanDays.length === 0) {
      return NextResponse.json(
        { error: "Validation Error: Please select at least one available day of the week." },
        { status: 400 }
      );
    }

    if (!consentToContact) {
      return NextResponse.json(
        { error: "Validation Error: Consent to be contacted for volunteering is required." },
        { status: 400 }
      );
    }

    const id = `vol-${Date.now()}`;
    const now = new Date().toISOString();
    const cleanInterests = Array.isArray(areasOfInterest) ? areasOfInterest : [];
    const status = "PENDING";
    const cleanEmail = (email || "").trim();
    const cleanSkills = (skills || "").trim();
    const cleanOccupation = (occupation || "").trim();
    const cleanMessage = (message || "").trim();
    const cleanTime = (availabilityTime || "Flexible").trim();

    const newRecord: VolunteerRecord = {
      id,
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      address: address.trim(),
      availableDays: cleanDays,
      availabilityTime: cleanTime,
      areasOfInterest: cleanInterests,
      skills: cleanSkills,
      occupation: cleanOccupation,
      message: cleanMessage,
      status,
      adminNotes: "",
      consentToContact: true,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await sql`
        INSERT INTO volunteers (
          id, name, phone, email, address,
          available_days, availability_time, areas_of_interest,
          skills, occupation, message, status, admin_notes,
          consent_to_contact, created_at, updated_at
        ) VALUES (
          ${id},
          ${newRecord.name},
          ${newRecord.phone},
          ${newRecord.email},
          ${newRecord.address},
          ${JSON.stringify(newRecord.availableDays)}::jsonb,
          ${newRecord.availabilityTime},
          ${JSON.stringify(newRecord.areasOfInterest)}::jsonb,
          ${newRecord.skills},
          ${newRecord.occupation},
          ${newRecord.message},
          ${status},
          ${""},
          ${true},
          ${now},
          ${now}
        )
      `;
    } catch (dbErr) {
      console.warn("Supabase POST /api/volunteers error, saving locally:", dbErr);
    }

    localVolunteersStore.unshift(newRecord);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for volunteering! Your application has been received.",
        id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/volunteers error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to submit volunteer application." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/volunteers
 * ADMIN ONLY — Update status & admin notes
 */
export async function PATCH(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing required volunteer ID." }, { status: 400 });
    }

    const now = new Date().toISOString();

    try {
      if (status && adminNotes !== undefined) {
        await sql`
          UPDATE volunteers
          SET status = ${status}, admin_notes = ${adminNotes}, updated_at = ${now}
          WHERE id = ${id}
        `;
      } else if (status) {
        await sql`
          UPDATE volunteers
          SET status = ${status}, updated_at = ${now}
          WHERE id = ${id}
        `;
      } else if (adminNotes !== undefined) {
        await sql`
          UPDATE volunteers
          SET admin_notes = ${adminNotes}, updated_at = ${now}
          WHERE id = ${id}
        `;
      }
    } catch (dbErr) {
      console.warn("Supabase PATCH /api/volunteers error, updating local memory:", dbErr);
    }

    const localIdx = localVolunteersStore.findIndex((v) => v.id === id);
    if (localIdx !== -1) {
      if (status) localVolunteersStore[localIdx].status = status;
      if (adminNotes !== undefined) localVolunteersStore[localIdx].adminNotes = adminNotes;
      localVolunteersStore[localIdx].updatedAt = now;
    }

    return NextResponse.json({
      success: true,
      message: "Volunteer application updated successfully.",
    });
  } catch (err: any) {
    console.error("PATCH /api/volunteers error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update volunteer record." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/volunteers
 * ADMIN ONLY — Delete a volunteer record
 */
export async function DELETE(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing required volunteer ID parameter." }, { status: 400 });
    }

    try {
      await sql`DELETE FROM volunteers WHERE id = ${id}`;
    } catch (dbErr) {
      console.warn("Supabase DELETE /api/volunteers error, deleting locally:", dbErr);
    }

    const idx = localVolunteersStore.findIndex((v) => v.id === id);
    if (idx !== -1) {
      localVolunteersStore.splice(idx, 1);
    }

    return NextResponse.json({ success: true, message: "Volunteer record deleted successfully." });
  } catch (err: any) {
    console.error("DELETE /api/volunteers error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete volunteer record." },
      { status: 500 }
    );
  }
}
