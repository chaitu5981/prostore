import "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string;
    };
  }
  interface JWT {
    role: string;
    id: string;
  }
  interface User {
    role: string;
    id: string;
  }
}
