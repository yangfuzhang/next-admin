import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/actions";
import { UserStatusEnum } from "@/types/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    // 自定义登录页面
    signIn: "/auth/login",
  },
  // 过期时间7天
  session: { strategy: "jwt", maxAge: 7 * 24 * 3600 },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        const dbUser = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
        });

        if (!dbUser) {
          throw new Error("Invalid credentials");
        }

        if (dbUser.status === UserStatusEnum.DISABLED) {
          throw new Error("Account disabled");
        }

        if (!(await verifyPassword(password as string, dbUser.password))) {
          throw new Error("Invalid password");
        }

        return dbUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isSuper = user.isSuper;
      }

      return token;
    },

    async authorized({ request, auth }) {
      if (!auth?.user) {
        return false;
      }

      const { pathname } = request.nextUrl;

      if (pathname === "/") {
        return NextResponse.redirect(new URL("/chat", request.nextUrl));
      }

      return true;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.isSuper = token.isSuper as number;

      return session;
    },
  },
});
