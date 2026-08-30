import { defineConfig } from "drizzle-kit";
import path from "path";

// Support both DATABASE_URL (Replit standard) and BUYTUK_DATABASE_URL (platform-specific alias)
const databaseUrl = process.env.BUYTUK_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Database connection string is required. " +
    "Set DATABASE_URL or BUYTUK_DATABASE_URL in your environment."
  );
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  out: path.join(__dirname, "./drizzle"),
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: process.env.NODE_ENV === "development",
  strict: true,
});
