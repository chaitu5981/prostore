import { auth } from "@/auth";
import SignInForm from "@/components/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Sign-In",
};
const SignInPage = async () => {
  const session = await auth();
  if (session) redirect("/");
  return (
    <Card className="w-full max-w-md flex-center">
      <CardHeader className="w-full  flex-col-center gap-4">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={70}
          height={70}
          priority
        />
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <SignInForm />
      </CardContent>
      <CardFooter>
        <p className="text-sm">
          Don&apos;t have an account?
          <span>
            <Link href={"/sign-up"} className="underline">
              {"  "}Sign Up
            </Link>
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};
export default SignInPage;
