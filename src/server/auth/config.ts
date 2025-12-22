import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider,
    Credentials({
      name: "Demo Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
      },
      async authorize(credentials) {
        // Mock user for demo purposes
        // In a real app, verify against DB
        const user = await db.user.findFirst({
          where: { email: "demo@freestand.in" }
        });

        if (user) {
          return user;
        }

        // Fallback if seeded user not found
        return {
          id: "mock-user-id",
          name: "Demo User",
          email: "demo@freestand.in",
          image: "",
        };
      }
    })
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
      },
    }),
  },
} satisfies NextAuthConfig;
