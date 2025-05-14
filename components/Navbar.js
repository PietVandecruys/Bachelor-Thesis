import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand / Home Link */}
        <Link href="/" className="text-white text-lg font-semibold hover:text-gray-200 transition">
          Home
        </Link>

        {/* Hamburger Icon (only on mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex items-center text-white focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {/* Hamburger icon */}
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen
                ? "M6 18L18 6M6 6l12 12" // X icon
                : "M4 8h16M4 16h16"}      // Hamburger
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6">
          {session ? (
            <>
              <Link href="/dashboard/profile" className="text-white hover:text-gray-200 transition">
                Profile
              </Link>
              <Link href="/dashboard" className="text-white hover:text-gray-200 transition">
                Progress Dashboard
              </Link>
              <Link href="/practice" className="text-white hover:text-gray-200 transition">
                Practice Tests
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-white hover:text-gray-200 transition"
              >
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

      {/* Mobile Dropdown Menu */}
      <div className={`lg:hidden transition-all duration-200 bg-gray-700 ${menuOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col space-y-2 px-4 pb-4">
          {session ? (
            <>
              <Link href="/dashboard/profile" className="text-white hover:text-gray-200 py-2 transition" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <Link href="/dashboard" className="text-white hover:text-gray-200 py-2 transition" onClick={() => setMenuOpen(false)}>
                Progress Dashboard
              </Link>
              <Link href="/practice" className="text-white hover:text-gray-200 py-2 transition" onClick={() => setMenuOpen(false)}>
                Practice Tests
              </Link>
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                className="text-white hover:text-gray-200 py-2 text-left transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="text-white hover:text-gray-200 py-2 transition" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="text-white hover:text-gray-200 py-2 transition" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
