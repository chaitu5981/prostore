"use server";
import { signIn, signOut } from "@/auth";
import { signInSchema, signUpSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "../prisma";
import { hashSync } from "bcrypt-ts-edge";
import { formatError } from "../utils";

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
    console.log(error.name);
    console.log(error.meta);
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
};
