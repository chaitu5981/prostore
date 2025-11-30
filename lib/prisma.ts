import { PrismaClient } from "@/generated/prisma/client";
import { neon, type HTTPQueryOptions } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};
const connString = process.env.DATABASE_URL;
if (!connString) {
  throw new Error("DATABASE_URL is not set");
}
const adapter =
  process.env.NODE_ENV === "production"
    ? new PrismaNeon({ connectionString: connString })
    : new PrismaPg({ connectionString: connString });
let prisma: PrismaClient;
if (process.env.NODE_ENV == "development")
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
else prisma = new PrismaClient({ adapter });

if (process.env.NODE_ENV == "development") globalForPrisma.prisma = prisma;
export { prisma };
