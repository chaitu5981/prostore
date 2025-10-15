import { Product } from "@/types";
import { prisma } from "@/lib/prisma";
export const getProducts = async (): Promise<Product[]> => {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return data.map((p) => ({
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
  }));
};
