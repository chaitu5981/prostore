import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full flex-center min-h-screen">{children}</div>;
};
export default AuthLayout;
