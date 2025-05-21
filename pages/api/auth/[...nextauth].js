import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_USER,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_USER
);

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_USER,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) return null;

        const { data, error } = await supabaseAuth.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data?.user) {
          console.error("Supabase sign-in failed:", error);
          throw new Error("Email or password is incorrect.");
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      // Allow email/password sign-in
      if (account?.provider === "credentials") return true;

      // For Google/GitHub sign-in, check if user exists in Supabase `profiles`
      const { data, error } = await supabaseServer
        .from("profiles")
        .select("id")
        .eq("email", user?.email)
        .single();

      if (data) return true; // user exists, allow sign-in

      console.warn("Blocked OAuth sign-in — user not found in Supabase:", user?.email);

      // Redirect to sign-up page
      return "/signup"; // This is the redirection URL for users who haven't signed up
    },

    async jwt({ token, user }) {
      if (user) {
        // Try to load user ID from profiles
        const { data: existingUser, error } = await supabaseServer
          .from("profiles")
          .select("id")
          .eq("email", user.email)
          .single();

        token.id = existingUser?.id ?? user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
});
