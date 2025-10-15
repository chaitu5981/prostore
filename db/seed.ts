import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
import sampleData from "./sample-data";
async function seed() {
  await prisma.product.createMany({ data: sampleData.products });
  console.log("Seeding completed");
}

seed();
