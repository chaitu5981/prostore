"use server";
import { auth, signIn, signOut } from "@/auth";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInSchema,
  signUpSchema,
  updateUserSchema,
} from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "../prisma";
import { hashSync } from "bcrypt-ts-edge";
import { formatError } from "../utils";
import { PaymentMethod, ShippingAddress } from "@/types";
import { UserWhereInput } from "@/generated/prisma/models";
import z from "zod";

export const signInWithCredentials = async (formData: FormData) => {
  try {
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "User signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid Credentials" };
  }
};

export const signOutUser = async () => {
  await signOut();
  revalidatePath("/");
};

export const signUpUser = async (formData: FormData) => {
  try {
    const user = signUpSchema.parse({
      name: formData.get("name"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      email: formData.get("email"),
    });
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashSync(user.password, 10),
      },
    });
    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });
    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async ({
  limit,
  page,
  query,
}: {
  limit: number;
  page: number;
  query: string;
}) => {
  try {
    const queryFilter: UserWhereInput =
      query && query != "all"
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            },
          }
        : {};
    const users = await prisma.user.findMany({
      where: queryFilter,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    const productCount = await prisma.user.count({
      where: queryFilter,
    });
    return {
      success: true,
      data: users,
      noOfPages: Math.ceil(productCount / limit),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();
    const user = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!user) throw new Error("User not found");
    const shippingAddress = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: user.id },
      data: { address: shippingAddress },
    });
    return {
      success: true,
      message: "Updated User Address",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const updateUserPaymentMethod = async (data: PaymentMethod) => {
  try {
    const session = await auth();
    const user = await prisma.user.findFirst({
      where: {
        id: session?.user.id,
      },
    });
    if (!user) throw new Error("User not found");
    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });
    return {
      success: true,
      message: "Payment Method updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const updateUserProfile = async (name: string) => {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("User not found");
    await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        name,
      },
    });
    return {
      success: true,
      message: "User Profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const updateUser = async (user: z.infer<typeof updateUserSchema>) => {
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        role: user.role,
      },
    });
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
