import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
import sampleData from "./sample-data";
async function seed() {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });
  console.log("Seeding completed");
}

seed();
