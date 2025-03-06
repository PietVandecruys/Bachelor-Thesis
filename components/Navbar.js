// components/Navbar.js
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-semibold">
          Home
        </Link>
        <div className="space-x-6">
          {session ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-gray-200 transition">
                Dashboard
              </Link>
              <Link href="/practice" className="text-white hover:text-gray-200 transition">
                Practice Tests
              </Link>
              <button onClick={() => signOut()} className="text-white hover:text-gray-200 transition">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="text-white hover:text-gray-200 transition">
                Sign In
              </Link>
              <Link href="/signup" className="text-white hover:text-gray-200 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
