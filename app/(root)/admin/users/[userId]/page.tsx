import UpdateUserForm from "@/components/admin/update-user-form";
import Loader from "@/components/Loader";
import { getUserById } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const UpdateUser = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;
  const user = await getUserById(userId);
  if (!user) notFound();
  return (
    <UpdateUserForm
      user={{
        id: user?.id,
        email: user.email,
        name: user?.name,
        role: user?.role,
      }}
    />
  );
};
const UpdateUserPage = ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <UpdateUser params={params} />
    </Suspense>
  );
};
export default UpdateUserPage;
