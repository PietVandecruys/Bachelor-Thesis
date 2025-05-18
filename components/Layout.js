import Link from 'next/link';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-6">
          <h1 className="text-3xl font-bold text-gray-800">CFA Exam Prep</h1>
        </div>
      </header>

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="container mx-auto flex-grow px-4 sm:px-6 lg:px-10 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 text-center text-sm">
          <p>© {new Date().getFullYear()} CFA Exam Prep. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/" className="underline hover:text-blue-800 mx-2">Privacy</Link> |
            <Link href="/" className="underline hover:text-blue-800 mx-2">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
