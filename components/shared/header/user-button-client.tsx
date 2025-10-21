"use client";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutButton from "./sign-out-button";
import { useState } from "react";
import Loader from "@/components/Loader";
type sessionUser = {
  name?: string | null;
  email?: string | null;
  id?: string;
};
const UserButtonClient = ({
  sessionUser,
}: {
  sessionUser: sessionUser | undefined;
}) => {
  const [signingOut, setSigningOut] = useState(false);
  console.log("Session User", sessionUser);
  if (signingOut) return <Loader />;
  if (!sessionUser)
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon />
          Sign In
        </Link>
      </Button>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full bg-gray-400 hover:bg-gray-300 px-3"
        >
          {sessionUser?.name?.slice(0, 1).toUpperCase() || "U"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p>{sessionUser?.name}</p>
          <p className="text-gray-400 text-sm">{sessionUser?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuItem className="p-0">
          <SignOutButton setSigningOut={setSigningOut} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButtonClient;
