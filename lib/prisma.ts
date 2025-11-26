import { PrismaClient } from "@/generated/prisma";
import { neon, type HTTPQueryOptions } from "@neondatabase/serverless";
import { PrismaNeonHTTP } from "@prisma/adapter-neon";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const sql = process.env.DATABASE_URL;
if (!sql) {
  throw new Error("DATABASE_URL is not set");
}
const adapter = new PrismaNeonHTTP(
  sql,
  {} satisfies HTTPQueryOptions<boolean, boolean>
);
let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  prisma = globalForPrisma.prisma || new PrismaClient();
}

if (process.env.NODE_ENV == "development") globalForPrisma.prisma = prisma;
export { prisma };
