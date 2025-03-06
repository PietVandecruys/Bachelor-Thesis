// pages/index.js
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to CFA Exam Prep
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Prepare thoroughly for your CFA exam with our innovative, interactive platform.
        </p>
        <Link
          href="/signin"
          className="inline-block bg-primary text-black px-8 py-4 rounded-md shadow-lg hover:bg-secondary transition"
        >
          Get Started
        </Link>
      </div>
    </Layout>
  );
}
