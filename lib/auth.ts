import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email || "";
        const password = credentials?.password || "";

        const demoEmail = process.env.DEMO_USER_EMAIL || "demo@legaledge.ai";
        const demoPassword = process.env.DEMO_USER_PASSWORD || "legaledge-demo";

        if (email === demoEmail && password === demoPassword) {
          return { id: "demo-user", name: "Demo User", email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};
