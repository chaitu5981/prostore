import Header from "@/components/shared/header";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="w-full flex-center mt-5 ">{children}</div>;
    </div>
  );
};
export default AuthLayout;
