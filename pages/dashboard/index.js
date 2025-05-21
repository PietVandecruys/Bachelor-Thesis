// pages/dashboard/index.js

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { supabaseModules, supabaseAuth } from '../../lib/supabaseClient';
import { Line } from 'react-chartjs-2';
import ModuleProgressSection from '../../components/dashboard/ModuleProgress';
import StudyStreakMilestoneSection from '../../components/dashboard/StudyStreakMilestone';

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testHistory, setTestHistory] = useState([]);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  const [averageScore, setAverageScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lastTest, setLastTest] = useState(null);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    async function fetchData() {
      // Fetch user data
      const { data: user, error: userError } = await supabaseAuth
        .from('profiles')
        .select('id, full_name')
        .eq('email', session.user.email)
        .single();

      if (!user || userError) {
        setUserName('User');
        setTestHistory([]);
        setLoading(false);
        return;
      }
      setUserName(user.full_name || 'User');

      // Fetch test sessions
      const { data: testSessions, error: testError } = await supabaseModules
        .from('test_sessions')
        .select('id, score, start_time, time_spent, question_count, modules(module_name)')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (testError) {
        setTestHistory([]);
        setLoading(false);
        return;
      }

      // Fetch correct answers for each test session
      const testHistoryWithAnswers = await Promise.all(
        (testSessions || []).map(async (test) => {
          const { data: correctAnswers } = await supabaseModules
            .from('test_answers')
            .select('id')
            .eq('test_session_id', test.id)
            .eq('is_correct', true);

          const formattedTime = test.time_spent
            ? `${Math.floor(test.time_spent / 60)} min ${test.time_spent % 60} sec`
            : 'N/A';

          return {
            id: test.id,
            module_name: test.modules?.module_name || 'Unknown Module',
            score: test.score,
            correct_answers: `${correctAnswers ? correctAnswers.length : 0} out of ${test.question_count || '?'}`,
            time_spent: formattedTime,
            start_time: test.start_time,
          };
        })
      );
      setTestHistory(testHistoryWithAnswers);
      setLoading(false);
    }
    fetchData();
  }, [session]);

  useEffect(() => {
    if (testHistory.length > 0) {
      const scores = testHistory.map((test) => test.score);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      setAverageScore(Math.round(avg));
      setBestScore(Math.max(...scores));
      setLastTest(testHistory[0]);
    }
  }, [testHistory]);

  if (status === 'loading' || loading) {
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

  const startNewTest = () => {
    router.push('/practice');
  };

  // --------- Chart data ---------
  // Get all modules and scores per module
  const moduleScoresMap = {};
  testHistory
    .slice()
    .reverse()
    .forEach((test) => {
      const module = test.module_name || 'Unknown Module';
      if (!moduleScoresMap[module]) moduleScoresMap[module] = [];
      moduleScoresMap[module].push({
        score: test.score,
        start_time: test.start_time,
      });
    });

  const maxTests = Math.max(
    ...Object.values(moduleScoresMap).map((scores) => scores.length),
    0
  );
  const allTestLabels = Array.from({ length: maxTests }, (_, i) => `Test ${i + 1}`);
  const colorPalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const allModules = Object.keys(moduleScoresMap);

  const moduleScores = {};
  allModules.forEach((module) => {
    const scores = moduleScoresMap[module].map((item) => item.score);
    while (scores.length < maxTests) {
      scores.push(null);
    }
    moduleScores[module] = scores;
  });

  const performanceData = {
    labels: allTestLabels,
    datasets: allModules.map((module, index) => ({
      label: module,
      data: moduleScores[module],
      spanGaps: true,
      borderColor: colorPalette[index % colorPalette.length],
      backgroundColor: 'transparent',
      fill: false,
    })),
  };

  const performanceOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const yVal = context.parsed.y;
            return yVal !== null
              ? `${context.dataset.label}: ${yVal}%`
              : `${context.dataset.label}: geen test`;
          },
        },
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: `Number of Tests`,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
        title: {
          display: true,
          text: 'Score (%)',
        },
      },
    },
  };

  return (
    <Layout>
      {/* Overview Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <p className="mb-6 text-gray-700">
          Welcome, {userName}! Here’s your CFA study progress.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 border rounded-lg shadow">
            <p className="text-gray-600">Total Tests</p>
            <p className="text-xl font-semibold">{testHistory.length}</p>
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

        {lastTest && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-gray-600">
              <strong>Last Test:</strong> {new Date(lastTest.start_time).toLocaleDateString()} -{' '}
              <span className="font-semibold">{lastTest.score}%</span>{' '}
              {lastTest.module_name && ` | ${lastTest.module_name}`}
            </p>
          </div>
        )}

        <button
          onClick={startNewTest}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition w-full"
        >
          Start a New Test
        </button>
      </div>
      {/* Study Streak and Milestone section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <StudyStreakMilestoneSection />
      </div>
      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Performance Analytics
        </h3>
        <Line data={performanceData} options={performanceOptions} />
      </div>
      {/* Module Progress Section */}
      <ModuleProgressSection />
    </Layout>
  );
}
