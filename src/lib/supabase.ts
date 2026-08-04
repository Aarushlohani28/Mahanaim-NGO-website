import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zvbyafopdxtfdqucilgl.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key";

if (!connectionString) {
  throw new Error("Missing required env variable: DATABASE_URL");
}

// Postgres SQL client for server-side queries
export const sql = postgres(connectionString, {
  ssl: "require",
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Supabase REST & Storage Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

