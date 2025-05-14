import { useState } from 'react';
import Layout from '../components/Layout';
import { supabaseAuth } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Field for full name
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Register user with Supabase authentication
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      // Add user name and other details to the 'profiles' table
      const { error: profileError } = await supabaseAuth
        .from('profiles')
        .upsert({
          id: data.user.id, // User ID from auth table
          full_name: fullName, // Full name
          email: email,
          avatar_url: null, // Default avatar URL
        });

      if (profileError) {
        setMessage('Error while saving profile: ' + profileError.message);
      } else {
        setMessage('User successfully registered!');
        setEmail('');
        setPassword('');
        setFullName(''); // Reset the full name field after registration
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
        <p className="text-sm text-gray-600 mb-4">
            It seems you were trying to log in, but don't have an account yet. Please fill in the details below to sign up and continue.        </p>
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
