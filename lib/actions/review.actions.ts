"use server";
import z from "zod";
import { insertReviewSchema } from "../validators";
import { auth } from "@/auth";
import { formatError } from "../utils";
import { prisma } from "../prisma";
export const createUpdateReview = async (
  data: z.infer<typeof insertReviewSchema>
) => {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("User not authenticated");
    const res = insertReviewSchema.safeParse(data);
    if (!res.success) throw new Error(Object.values(res.error)[0]);
    const product = await prisma.product.findFirst({
      where: {
        id: res.data.productId,
      },
    });
    if (!product) throw new Error("Product not found");
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: res.data.productId,
      },
    });
    console.log("Existing", existingReview);
    await prisma.$transaction(async (tx) => {
      if (!existingReview) {
        await tx.review.create({
          data: { ...res.data, rating: Number(res.data.rating) },
        });
      } else
        await tx.review.update({
          where: {
            id: existingReview.id,
          },
          data: { ...res.data, rating: Number(res.data.rating) },
        });
      const avgRating = await tx.review.aggregate({
        where: {
          productId: res.data.productId,
        },
        _avg: {
          rating: true,
        },
      });
      const numReviews = await tx.review.count({
        where: {
          productId: res.data.productId,
        },
      });
      await tx.product.update({
        where: {
          id: res.data.productId,
        },
        data: {
          rating: avgRating._avg.rating || 0,
          numReviews,
        },
      });
    });
    return {
      success: true,
      message: "Review submitted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getReviewByUser = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  const review = await prisma.review.findFirst({
    where: {
      userId,
      productId,
    },
  });
  return review;
};

export const getAllReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return reviews.map((review) => ({
    ...review,
    rating: review.rating.toString(),
  }));
};
