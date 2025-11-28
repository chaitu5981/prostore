import { Suspense } from "react";
import UserButton from "./user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";

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
