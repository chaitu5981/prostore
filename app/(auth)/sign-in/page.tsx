import { auth } from "@/auth";
import SignInForm from "@/components/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await auth();
  if (session) redirect("/");
  return (
    <Card className="w-full max-w-md flex-center">
      <CardHeader className="w-full  flex-col-center gap-4">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <SignInForm />
      </CardContent>
    </Card>
  );
};
export default SignInPage;
