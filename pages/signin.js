// pages/signin.js
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    // This will redirect automatically if sign in is successful.
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/',
      redirect: true,
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </Layout>
  );
}
