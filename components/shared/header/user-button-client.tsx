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
  role?: string;
};
const UserButtonClient = ({
  sessionUser,
}: {
  sessionUser: sessionUser | undefined;
}) => {
  const [showLoader, setShowLoader] = useState(false);
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
          {showLoader ? (
            <Loader size={20} />
          ) : (
            sessionUser?.name?.slice(0, 1).toUpperCase() || "U"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p>{sessionUser?.name}</p>
          <p className="text-gray-400 text-sm">{sessionUser?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuItem className="p-0">
          <SignOutButton setShowLoader={setShowLoader} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButtonClient;
