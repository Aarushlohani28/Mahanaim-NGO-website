const postgres = require("postgres");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL environment variable is missing.");
  process.exit(1);
}
const sql = postgres(connectionString);

async function init() {
  console.log("Creating 'causes' and 'gallery' tables in Supabase PostgreSQL...");

  await sql`
    CREATE TABLE IF NOT EXISTS causes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      goal_amount NUMERIC DEFAULT 0,
      raised_amount NUMERIC DEFAULT 0,
      image_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      image_url TEXT NOT NULL,
      hover_description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  console.log("SUCCESS: Created 'causes' and 'gallery' tables!");
  await sql.end();
}

init().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
