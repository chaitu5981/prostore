"use server";
import { auth, signIn, signOut } from "@/auth";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "../prisma";
import { hashSync } from "bcrypt-ts-edge";
import { formatError } from "../utils";
import { PaymentMethod, ShippingAddress } from "@/types";

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
