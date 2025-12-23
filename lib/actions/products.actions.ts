import { Product } from "@/types";
import { prisma } from "@/lib/prisma";
import { Product as PrismaProduct } from "@/generated/prisma/client";
import { formatError } from "../utils";
import z from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";
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

export const getAllProducts = async ({
  limit,
  page,
}: {
  limit: number;
  page: number;
}) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    const productCount = await prisma.product.count();
    return {
      success: true,
      data: products,
      noOfPages: Math.ceil(productCount / limit),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const createProduct = async (
  data: z.infer<typeof insertProductSchema>
) => {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({
      data: product,
    });
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
};
export const updateProduct = async (
  data: z.infer<typeof updateProductSchema>
) => {
  try {
    const product = updateProductSchema.parse(data);
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: product.id,
      },
    });
    if (!existingProduct) throw new Error("Product not found");
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
};
