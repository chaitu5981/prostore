import NextAuth from "next-auth";
import { prisma } from "./lib/prisma";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  debug: true,
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          if (isMatch)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user, token, trigger }) => {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      if (trigger == "update") session.user.name = user.name;
      // console.log("Session1", session);
      return session;
    },
    jwt: async ({ token, user }) => {
      // console.log("User in jwt", user);
      // console.log("token in jwt", token);
      if (user) token.role = user.role;
      // else {
      //   const dbUser = await prisma.user.findFirst({
      //     where: {
      //       email: token.email as string,
      //     },
      //   });
      //   if (dbUser) token.role = dbUser.role;
      // }
      return token;
    },
  },
});
