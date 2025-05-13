import { useSession, signIn, getSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Supabase client
const supabaseModules = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_MODULES || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_MODULES || ''
);

export default function DashboardPage({ testHistory, userName }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tests, setTests] = useState(testHistory);
  const [expandedTest, setExpandedTest] = useState(null);
  const [averageScore, setAverageScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lastTest, setLastTest] = useState(null);

  useEffect(() => {
    if (tests.length > 0) {
      const scores = tests.map(test => test.score);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      setAverageScore(Math.round(avg));
      setBestScore(Math.max(...scores));
      setLastTest(tests[0]); // Most recent test
    }
  }, [tests]);

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
        <p className="text-gray-700">You must be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
        >
          Sign In
        </button>
      </Layout>
    );
  }

  // ✅ Delete Test Function
  const deleteTest = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test? This action cannot be undone.")) {
      await supabaseModules.from('test_answers').delete().eq('test_session_id', testId);
      await supabaseModules.from('test_sessions').delete().eq('id', testId);
      setTests(tests.filter(test => test.id !== testId));
    }
  };

  // ✅ Toggle test details visibility
  const toggleTestDetails = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  // ✅ Start New Test
  const startNewTest = () => {
    router.push('/practice');
  };

  return (
    <Layout>
      {/* Overview Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <p className="mb-6 text-gray-700">Welcome, {userName}! Here’s your CFA study progress.</p>

        {/* Test Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 border rounded-lg shadow">
            <p className="text-gray-600">Total Tests</p>
            <p className="text-xl font-semibold">{tests.length}</p>
          </div>
          <div className="p-4 border rounded-lg shadow">
            <p className="text-gray-600">Avg. Score</p>
            <p className="text-xl font-semibold">{averageScore}%</p>
          </div>
          <div className="p-4 border rounded-lg shadow">
            <p className="text-gray-600">Best Score</p>
            <p className="text-xl font-semibold">{bestScore}%</p>
          </div>
        </div>

        {/* Last Test Info */}
        {lastTest && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-gray-600">
              <strong>Last Test:</strong> {new Date(lastTest.start_time).toLocaleDateString()} - 
              <span className="font-semibold"> {lastTest.score}%</span> 
              {lastTest.module_name && ` | ${lastTest.module_name}`}
            </p>
          </div>
        )}

        {/* Start New Test Button */}
        <button
          onClick={startNewTest}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition w-full"
        >
          Start a New Test
        </button>
      </div>

      {/* Test History Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Test History</h3>
        <div className="divide-y">
          {tests.map((test) => (
            <div key={test.id} className="py-4">
              {/* ✅ Collapsed View - Show Module Name & Date */}
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                onClick={() => toggleTestDetails(test.id)}
              >
                {/* Module Name & Test Date */}
                <span className="text-lg font-semibold text-gray-800">
                  {test.module_name} 
                  <span className="text-gray-500 text-sm"> ({new Date(test.start_time).toLocaleDateString()})</span>
                </span>

                {/* Expand/Collapse Arrow */}
                <span className="text-gray-500">{expandedTest === test.id ? '▲' : '▼'}</span>
              </div>

              {/* ✅ Expanded View - Show More Details */}
              {expandedTest === test.id && (
                <div className="mt-3 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600"><strong>Score:</strong>  
                      <span className={`ml-2 font-semibold ${
                        test.score < 50 ? 'text-red-600' :
                        test.score < 75 ? 'text-yellow-500' : 'text-green-600'
                      }`}>
                        {test.score}%
                      </span>
                    </p>
                    <p className="text-sm text-gray-600"><strong>Correct Answers:</strong> {test.correct_answers}</p>
                    <p className="text-sm text-gray-600"><strong>Time Spent:</strong> {test.time_spent ? `${test.time_spent}` : "N/A"}</p>
                  </div>

                  {/* 🗑️ Trash Can Icon Button */}
                  <button
                    onClick={() => deleteTest(test.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete Test"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  // Supabase client for authentication
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL_USER,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_USER
  );

  // Fetch the user ID from the authentication database
  const { data: user, error: userError } = await supabaseAuth
    .from("profiles")
    .select("id, full_name")
    .eq("email", session.user.email)
    .single();

  if (userError || !user) {
    console.error("User not found in Supabase:", userError);
    return { props: { testHistory: [], userName: null } };
  }

  const userId = user.id;
  const userName = user.full_name || "User";

  // Fetch test sessions for the logged-in user
  const { data: testSessions, error: testError } = await supabaseModules
    .from('test_sessions')
    .select('id, score, start_time, time_spent, question_count, modules(module_name)')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });

  if (testError) {
    console.error("Supabase Error:", testError);
    return { props: { testHistory: [], userName } };
  }

  // Fetch correct answers count per test session
  const testHistory = await Promise.all(
    testSessions.map(async (test) => {
      const { data: correctAnswers, error: answersError } = await supabaseModules
        .from("test_answers")
        .select("id")
        .eq("test_session_id", test.id)
        .eq("is_correct", true);

      const formattedTime = test.time_spent
        ? `${Math.floor(test.time_spent / 60)} min ${test.time_spent % 60} sec`
        : "N/A";

      return {
        id: test.id,
        module_name: test.modules?.module_name || "Unknown Module",
        score: test.score,
        correct_answers: `${correctAnswers ? correctAnswers.length : 0} out of ${test.question_count || "?"}`,
        time_spent: formattedTime,
        start_time: test.start_time ? new Date(test.start_time).toLocaleDateString() : "Invalid Date",
      };
    })
  );

  return { props: { testHistory, userName } };
}