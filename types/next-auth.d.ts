import "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string;
      name: string;
      email: string;
    };
  }
  interface JWT {
    role: string;
    id: string;
    name: string;
    email: string;
  }
  interface User {
    role: string;
    id: string;
    name: string;
    email: string;
  }
}
