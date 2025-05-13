import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";
import CredentialsProvider from "next-auth/providers/credentials";

// Supabase client
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_USER,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_USER
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
        try {
          const { email, password } = credentials;

          if (!email || !password) {
            console.error("Missing email or password");
            return null; // Return null to indicate authentication failure
          }

          console.log("Attempting to sign in with Supabase...");

          const { data, error } = await supabaseAuth.auth.signInWithPassword({
            email,
            password,
          });

          console.log("Supabase response:", { data, error });

          if (error || !data.user) {
            console.error("Error during sign-in:", error);
            return null; // Return null to indicate authentication failure
          }

          console.log("User authenticated successfully:", data.user);

          return { id: data.user.id, email: data.user.email, name: data.user.email };
        } catch (err) {
          console.error("Unexpected error in authorize function:", err);
          return null; // Return null to indicate authentication failure
        }
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
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Check if the user already exists in Supabase
        const { data: existingUser, error } = await supabaseAuth
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          // Use the existing user_id
          token.id = existingUser.id;
        } else {
          // Use the new user_id from the current login
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Attach token properties to the session
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
});