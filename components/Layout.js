// components/Layout.js
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">CFA Exam Prep</h1>
        </div>
      </header>

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="container mx-auto flex-grow px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-700 text-white">
        <div className="container mx-auto px-4 py-4 text-center">
          © {new Date().getFullYear()} CFA Exam Prep. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
