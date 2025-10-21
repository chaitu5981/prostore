import { auth } from "@/auth";
import SignUpForm from "@/components/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
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
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to Sign Up</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className="text-sm">
          Already have an account?
          <span>
            <Link href={"/sign-in"} className="underline">
              {"  "}Sign In
            </Link>
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};
export default SignUpPage;
