"use server";
import { signIn, signOut } from "@/auth";
import { signInSchema } from "@/lib/validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { toast } from "sonner";

export const signInWithCredentials = async (formData: FormData) => {
  console.log(formData.get("email"));
  console.log(formData.get("password"));
  try {
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Sign in successful" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid Credentials" };
  }
};

export const signOutUser = async () => {
  await signOut();
};
