import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

import authConfig from "@/auth.config";
import { db } from "@/lib/db";

const providers = authConfig.providers.map((provider) => {
  if (typeof provider === "function") {
    return provider;
  }

  if (provider.id !== "credentials") {
    return provider;
  }

  return Credentials({
    credentials: {
      email: {
        label: "Email",
        type: "email",
      },
      password: {
        label: "Password",
        type: "password",
      },
    },
    async authorize(credentials) {
      const email =
        typeof credentials?.email === "string"
          ? credentials.email.trim().toLowerCase()
          : "";
      const password =
        typeof credentials?.password === "string" ? credentials.password : "";

      if (!email || !password) {
        return null;
      }

      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user?.password) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  });
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db as Parameters<typeof PrismaAdapter>[0]),
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.sub === "string") {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  ...authConfig,
  providers,
});
