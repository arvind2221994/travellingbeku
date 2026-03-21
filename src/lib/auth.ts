/**
 * auth.ts — NextAuth v5 (beta) configuration
 *
 * Uses a simple Credentials provider backed by env-var username/password.
 * For a production upgrade, swap this for a proper OAuth provider.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const validUser = process.env.ADMIN_USERNAME;
        const validPass = process.env.ADMIN_PASSWORD;

        if (!validUser || !validPass) {
          console.error(
            "[auth] ADMIN_USERNAME or ADMIN_PASSWORD env vars are not set."
          );
          return null;
        }

        if (username === validUser && password === validPass) {
          return { id: "admin", name: "Admin", email: "admin@travellingbeku.com" };
        }

        return null;
      },
    }),
  ],
  pages: {
    // NOTE: signIn page exists but is NOT linked from anywhere publicly.
    // The admin route returns 404 to unauthenticated users (see middleware).
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (token.role) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
