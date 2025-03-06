// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "../../../lib/supabaseClient";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.session) {
          throw new Error(error?.message || "Invalid credentials");
        }

        // Retrieve the user object
        const user = data.user;

        // The name is stored in user.user_metadata.name if you set it at sign-up
        const name = user.user_metadata?.name || null;

        // Return an object that NextAuth will store in the session token
        return {
          id: user.id,
          email: user.email,
          name, // include the user's name here
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // We'll store the user data in a JWT
  },
  callbacks: {
    // Attach the user object to the token on sign in
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    // Make the name available in the session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
