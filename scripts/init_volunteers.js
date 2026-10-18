const postgres = require("postgres");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL environment variable is missing.");
  process.exit(1);
}
const sql = postgres(connectionString, { ssl: "require" });

async function initVolunteers() {
  console.log("Connecting to Supabase PostgreSQL and creating 'volunteers' table...");

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
  `;

  console.log("SUCCESS: Created 'volunteers' table in Supabase PostgreSQL!");
  await sql.end();
}

initVolunteers().catch((err) => {
  console.warn("Migration warning / offline fallback:", err.message);
  process.exit(0);
});
