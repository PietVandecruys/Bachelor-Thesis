// pages/dashboard.js

import { useSession, signIn } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import Layout from '../components/Layout';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function DashboardPage({ progressData, totalCorrect, totalAttempted }) {
  const { data: session, status } = useSession();

  // If session is still loading, show a loading message
  if (status === 'loading') {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  // If not logged in, show sign-in prompt
  if (!session) {
    return (
      <Layout>
        <p className="text-gray-700">You must be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Sign In
        </button>
      </Layout>
    );
  }

  // Compute overall accuracy as a percentage
  const accuracy = totalAttempted
    ? Math.round((totalCorrect / totalAttempted) * 100)
    : 0;

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h2>
      <p className="mb-6 text-gray-700">
        Welcome, {session.user.name}! Here’s your CFA study progress.
      </p>

      {/* Overall Progress Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Overall Accuracy</h3>
          <p className="text-gray-600">
            You have answered{' '}
            <span className="font-bold">{totalAttempted}</span> questions, with{' '}
            <span className="font-bold">{totalCorrect}</span> correct (
            <span className="font-bold">{accuracy}%</span>).
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Per-Module Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Progress by Module</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Module</th>
                <th className="py-2 px-4 border-b">Correct / Attempted</th>
                <th className="py-2 px-4 border-b">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((row) => {
                const moduleAccuracy = row.attempted_count
                  ? Math.round((row.correct_count / row.attempted_count) * 100)
                  : 0;
                return (
                  <tr key={row.module_id}>
                    <td className="py-2 px-4 border-b">{row.module_name || `Module #${row.module_id}`}</td>
                    <td className="py-2 px-4 border-b">
                      {row.correct_count} / {row.attempted_count}
                    </td>
                    <td className="py-2 px-4 border-b">{moduleAccuracy}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

// Server-side: fetch user progress from Supabase
export async function getServerSideProps() {
  // Hardcode a user ID for demo. In a real app, you'd get userId from session
  const userId = '00000000-0000-0000-0000-000000000000';

  // Query user_progress, joining modules to get the module_name
  const { data: progressRows, error } = await supabase
    .from('user_progress')
    .select(`
      module_id,
      correct_count,
      attempted_count,
      modules:module_id (
        module_name
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching progress data:', error);
    return { props: { progressData: [], totalCorrect: 0, totalAttempted: 0 } };
  }

  let totalCorrect = 0;
  let totalAttempted = 0;

  // Flatten and compute totals
  const progressData = (progressRows || []).map((row) => {
    totalCorrect += row.correct_count;
    totalAttempted += row.attempted_count;
    return {
      module_id: row.module_id,
      correct_count: row.correct_count,
      attempted_count: row.attempted_count,
      module_name: row.modules?.module_name
    };
  });

  return {
    props: {
      progressData,
      totalCorrect,
      totalAttempted
    }
  };
}
