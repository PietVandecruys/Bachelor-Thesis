// pages/signup.tsx

import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // 1. Register the user
      await axios.post("/api/auth/register", { email, password, fullName });

      // 2. Immediately sign in the user
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,         // You can set to false and manually redirect if you prefer
        callbackUrl: "/",       // Change if you want another post-signup page
      });

      if (result?.error) {
        setMessage(result.error);
      }
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Could not register. Try a different email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Please fill in the details below to sign up and continue.
        </p>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#002D74] text-white border py-2 w-full rounded-xl flex justify-center items-center hover:scale-105 duration-300"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </Layout>
  );
}
