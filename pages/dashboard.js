import { useSession, signIn } from 'next-auth/react';
import Layout from '../components/Layout';

export default function Dashboard() {
  const { data: session, status } = useSession();

  // Dummy data for demonstration
  const progress = 75;
  const studyHours = 120;

  if (status === 'loading') {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <p>You must be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Sign In
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <p className="mb-8">Welcome, {session.user.name}!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Study Progress</h3>
          <p className="text-gray-600">
            Your current progress: <span className="font-bold">{progress}%</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Study Hours</h3>
          <p className="text-gray-600">
            Total study hours logged: <span className="font-bold">{studyHours}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
