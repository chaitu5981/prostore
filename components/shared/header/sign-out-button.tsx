"use client";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const SignOutButton = ({
  setShowLoader,
}: {
  setShowLoader: (b: boolean) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const [signingOut, setSigningOut] = useState(false);

  const router = useRouter();
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOutUser();
      toast.success("Signed out successfully");
      startTransition(() => {
        router.refresh();
      });
      setShowLoader(isPending || signingOut);
    } catch (error) {
      console.log(error);
      if (isRedirectError(error)) {
        toast.success("Signed out successfully");
        throw error;
      }
      toast.error("Error in signing out");
      setSigningOut(false);
    }
  };
  return (
    <Button
      onClick={handleSignOut}
      variant="ghost"
      className="p-2"
      type="submit"
    >
      Sign Out
    </Button>
  );
};
export default SignOutButton;
