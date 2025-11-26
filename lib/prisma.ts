import { PrismaClient } from "@/generated/prisma";
import { neon, type HTTPQueryOptions } from "@neondatabase/serverless";
import { PrismaNeonHTTP } from "@prisma/adapter-neon";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const sql = neon(process.env.DATABASE_URL!);
const adapter = new PrismaNeonHTTP(
  sql.toString(),
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
