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
    setMessage(''); // Clear any previous messages

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/', // Redirect to the home page after login
      redirect: false, // Prevent automatic redirection
    });

    if (result?.error) {
      console.error('Sign-in error:', result.error);
      setMessage(result.error); // Display the error message to the user
    } else {
      console.log('Sign-in successful:', result);
      window.location.href = result.url; // Redirect manually if successful
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Log in</h2>
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
            className="bg-[#002D74] text-white border py-2 w-full rounded-xl flex justify-center items-center hover:scale-105 duration-300"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 flex flex-col gap-2">
          <button
            className="bg-white border py-2 w-full rounded-xl flex justify-center items-center hover:scale-105 duration-300 text-[#002D74]"
            onClick={() =>
              signIn('google', {
                callbackUrl: '/', // Redirect to the home page after login
              })
            }
          >
            <svg
              className="mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="25px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Login with Google
          </button>
          <button
            className="bg-black text-white border py-2 w-full rounded-xl flex justify-center items-center hover:scale-105 duration-300"
            onClick={() =>
              signIn('github', {
                callbackUrl: '/', // Redirect to the home page after login
              })
            }
          >
            <svg
              className="mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="25px"
            >
              <path
                fill="white"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.4.6.1.8-.3.8-.6v-2.1c-3.34.7-4.04-1.5-4.04-1.5-.6-1.5-1.48-1.8-1.48-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3.04 1.4 3.78 1.1.1-.9.5-1.4.9-1.8-2.67-.3-5.46-1.3-5.46-6A4.68 4.68 0 016.6 7.4c-.2-.3-.9-1.6.1-3.3 0 0 1.1-.3 3.3 1.2a11.14 11.14 0 016 0c2.2-1.5 3.3-1.2 3.3-1.2 1 1.7.3 3 .1 3.3.6.7 1 1.6 1 2.7 0 4.7-2.8 5.7-5.47 6 .5.4.9 1.1.9 2.1v3c0 .3.2.7.8.6C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
            Login with GitHub
          </button>
        </div>
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