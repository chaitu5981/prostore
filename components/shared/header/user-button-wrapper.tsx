import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import UserButtonClient from "./user-button-client";
import { auth } from "@/auth";

const UserButton = async () => {
  const session = await auth();
  return <UserButtonClient sessionUser={session?.user} />;
};

const UserButtonWrapper = () => {
  return (
    <Suspense
      fallback={
        <Button asChild>
          <Link href={"/sign-in"}>
            <UserIcon />
            Sign In
          </Link>
        </Button>
      }
    >
      <UserButton />
    </Suspense>
  );
};
export default UserButtonWrapper;
