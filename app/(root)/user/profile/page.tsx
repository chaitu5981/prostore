import { auth } from "@/auth";
import Loader from "@/components/Loader";
import UpdateProfileForm from "@/components/profile/update-profile-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

const ProfileContent = async () => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="flex h-screen justify-center mt-10">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold">Profile</p>
          <div className="flex gap-2">
            <Label>Email</Label>
            <Input value={session?.user.email} disabled />
          </div>
          <UpdateProfileForm />
        </div>
      </div>
    </SessionProvider>
  );
};
const ProfilePage = () => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <ProfileContent />
    </Suspense>
  );
};
export default ProfilePage;
