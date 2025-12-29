"use server";
import { Product } from "@/types";
import { prisma } from "@/lib/prisma";
import { Product as PrismaProduct } from "@/generated/prisma/client";
import { formatError } from "../utils";
import z from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";
import { ProductWhereInput } from "@/generated/prisma/models";
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
  stock: p.stock.toString(),
  rating: p.rating.toString(),
  numReviews: p.numReviews,
  createdAt: p.createdAt,
  banner: p.banner,
});

export const getLatestProducts = async (): Promise<Product[]> => {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return data.map((p) => convertPrismaObjToJSObj(p));
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
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
export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  const parsed = z.uuid().safeParse(productId);
  if (!parsed.success) return null;
  const res = await prisma.product.findFirst({
    where: { id: parsed.data },
  });
  if (res) return convertPrismaObjToJSObj(res);
  else return null;
};

export const getAllProducts = async ({
  limit,
  page,
  query,
  category,
  price,
  rating,
  sort,
}: {
  limit?: number;
  page?: number;
  query: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) => {
  try {
    const queryFilter: ProductWhereInput =
      query && query != "all"
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            },
          }
        : {};
    const categoryFilter: ProductWhereInput =
      category && category != "all"
        ? {
            category,
          }
        : {};
    const priceFilter: ProductWhereInput =
      price && price != "all"
        ? {
            price: {
              gte: Number(price.split("-")[0]),
              lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const ratingFilter: ProductWhereInput =
      rating && rating != "all"
        ? {
            rating: {
              gte: Number(rating),
            },
          }
        : {};
    const sortOrder =
      !sort || sort == "newest"
        ? {
            createdAt: "desc" as const,
          }
        : sort == "lowest"
        ? {
            price: "asc" as const,
          }
        : sort == "highest"
        ? {
            price: "desc" as const,
          }
        : sort == "rating"
        ? {
            rating: "desc" as const,
          }
        : {
            createdAt: "desc" as const,
          };
    const products = await prisma.product.findMany({
      where: {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
      orderBy: sortOrder,
      skip: ((page ? page : 1) - 1) * (limit ? limit : 0),
      take: limit,
    });
    const productCount = await prisma.product.count({
      where: {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
    });
    return {
      success: true,
      data: products.map((p) => convertPrismaObjToJSObj(p)),
      noOfPages: limit && Math.ceil(productCount / limit),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getCategories = async () => {
  const categories = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });
  return categories;
};

export const createProduct = async (
  data: z.infer<typeof insertProductSchema>
) => {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({
      data: { ...product, stock: Number(product.stock) },
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
      data: { ...product, stock: Number(product.stock) },
    });
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
