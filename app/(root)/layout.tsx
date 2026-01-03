import { auth } from "@/auth";
import Footer from "@/components/footer";
import Header from "@/components/shared/header";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const role = session?.user?.role || "undefined";
  return (
    <div>
      <Header role={role} />
      {children}
      <Footer />
    </div>
  );
};
export default HomeLayout;
