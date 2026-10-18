const postgres = require("postgres");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL environment variable is missing.");
  process.exit(1);
}
const sql = postgres(connectionString, { ssl: "require" });

async function init() {
  console.log("Connecting to Supabase PostgreSQL and creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      location TEXT,
      image_url TEXT,
      category TEXT,
      raised NUMERIC DEFAULT 0,
      target NUMERIC DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      donor_name TEXT,
      email TEXT,
      phone TEXT,
      pan TEXT,
      amount NUMERIC DEFAULT 0,
      order_id TEXT UNIQUE,
      payment_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  console.log("SUCCESS: Created 'events' and 'donations' tables in Supabase!");
  await sql.end();
}

init().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
