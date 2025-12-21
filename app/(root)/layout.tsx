import { auth } from "@/auth";
import Header from "@/components/shared/header";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const role = session?.user?.role || "undefined";
  return (
    <div>
      <Header role={role} />
      {children}
    </div>
  );
};
export default HomeLayout;
