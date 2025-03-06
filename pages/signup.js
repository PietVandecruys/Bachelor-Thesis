// pages/signup.js
import { useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState(''); // new state for name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    // Pass the name as user metadata in the options object
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });      
      
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('User successfully registered!');
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
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
            Sign Up
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </Layout>
  );
}
