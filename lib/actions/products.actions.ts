import { Product } from "@/types";
import { prisma } from "@/lib/prisma";
import { Product as PrismaProduct } from "@/generated/prisma";
const convertPrismaObjToJSObj = (p: PrismaProduct) => ({
  name: p.name,
  brand: p.brand,
  category: p.category,
  description: p.description,
  id: p.id,
  images: p.images,
  isFeatured: p.isFeatured,
  price: p.price.toString(),
  slug: p.slug,
  stock: p.stock,
  rating: p.rating.toString(),
  numReviews: p.numReviews,
  createdAt: p.createdAt,
});

export const getProducts = async (): Promise<Product[]> => {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return data.map((p) => convertPrismaObjToJSObj(p));
};

export const getProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  const res = await prisma.product.findFirst({
    where: { slug },
  });
  if (res) return convertPrismaObjToJSObj(res);
  else return null;
};
