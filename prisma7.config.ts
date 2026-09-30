import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // El CLI (migrate/db push/studio) necesita conexión directa, sin PgBouncer.
  // La app en runtime usa DATABASE_URL (pooled) directamente en src/lib/prisma.ts.
  // Se lee con process.env y no con env() para que `prisma generate` (paso del build
  // en Vercel, que no toca la base) funcione aunque DIRECT_URL no esté definida.
  datasource: {
    url: process.env.DIRECT_URL || "",
  },
});
