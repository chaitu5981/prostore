"use client";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { toast } from "sonner";

const SignOutButton = ({
  setSigningOut,
}: {
  setSigningOut: (b: boolean) => void;
}) => {
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOutUser();
      toast.success("Signed out successfully");
      //   router.refresh();
    } catch (error) {
      console.log(error);
      if (isRedirectError(error)) {
        toast.success("Signed out successfully");
        throw error;
      }
      toast.error("Error in signing out");
    } finally {
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
