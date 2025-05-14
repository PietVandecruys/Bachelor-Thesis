import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabaseUsers } from "../lib/supabaseUsers"; // user info DB
import { supabaseTests } from "../lib/supabaseTests"; // test data DB
import Layout from "../components/Layout";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("react-chartjs-2").then(m => m.Line), { ssr: false });

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    avatar_url: "",
    preferences: {},
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recentSessions, setRecentSessions] = useState([]);
  const [progress, setProgress] = useState([]);

  // Fetch all relevant data on mount or auth change
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    (async () => {
      // 1. Fetch user profile from User DB
      const { data: prof } = await supabaseUsers
        .from("profiles")
        .select("full_name, email, avatar_url, preferences")
        .eq("id", session.user.id)
        .single();
      if (prof) setProfile(p => ({ ...p, ...prof }));

      // 2. Fetch recent sessions from Test DB
      const { data: sessions } = await supabaseTests
        .from("test_sessions")
        .select("id, module_id, score, question_count, end_time, modules(module_name)")
        .eq("user_id", session.user.id)
        .order("end_time", { ascending: false })
        .limit(10);
      setRecentSessions(sessions || []);

      // 3. Fetch per-module progress from Test DB
      const { data: progressData } = await supabaseTests
        .from("user_progress")
        .select("module_id, correct_count, attempted_count, modules(module_name)")
        .eq("user_id", session.user.id);
      setProgress(progressData || []);
    })();
  }, [status, session?.user?.id]);

  // Profile save handler
  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabaseUsers
      .from("profiles")
      .update({
        full_name: profile.full_name,
        preferences: profile.preferences,
        avatar_url: profile.avatar_url,
      })
      .eq("id", session.user.id);
    if (!error) setEditing(false);
    setSaving(false);
  };

  if (status === "loading") return <Layout>Loading…</Layout>;
  if (!session) return (
    <Layout>
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="text-3xl font-semibold mb-4">Please sign in to view your dashboard.</h1>
      </div>
    </Layout>
  );

  // Chart: scores over time
  const chartData = (() => {
    const scores = recentSessions.slice().reverse();
    return {
      labels: scores.map(s => s.modules?.module_name || "Module"),
      datasets: [{
        label: "Score",
        data: scores.map(s => s.score),
        tension: 0.2,
      }],
    };
  })();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        {/* Profile Section */}
        <section className="bg-white shadow rounded-2xl p-6 flex gap-8 items-center">
          {/* Avatar */}
          <div>
            <img
              src={profile.avatar_url || "/default-avatar.png"}
              alt="Avatar"
              className="rounded-full w-24 h-24 object-cover"
            />
            {/* Add upload avatar logic here if you want */}
          </div>
          {/* Profile Details */}
          <div className="flex-1">
            <header className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Profile</h2>
              {editing ? (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  Edit
                </button>
              )}
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Full name</span>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                  disabled={!editing}
                  className="border rounded px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Email</span>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="border rounded px-3 py-2 bg-gray-100"
                />
              </label>
            </div>
            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Preferred Topics</span>
                <input
                  type="text"
                  value={profile.preferences.topics || ""}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, topics: e.target.value },
                    })
                  }
                  disabled={!editing}
                  className="border rounded px-3 py-2"
                  placeholder="e.g. Quant, Ethics, Portfolio"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Difficulty (1-5)</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={profile.preferences.difficulty || 3}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, difficulty: Number(e.target.value) },
                    })
                  }
                  disabled={!editing}
                />
                <span className="text-xs text-gray-500">
                  {profile.preferences.difficulty || 3}
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Module Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progress.length === 0 && <p>No progress yet.</p>}
            {progress.map(p => (
              <div key={p.module_id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{p.modules?.module_name || "Module"}</span>
                  <span className="text-xs text-gray-500">{p.correct_count}/{p.attempted_count} correct</span>
                </div>
                <div className="h-3 bg-gray-100 rounded">
                  <div
                    className="h-3 bg-green-500 rounded transition-all"
                    style={{
                      width:
                        p.attempted_count > 0
                          ? `${Math.round((p.correct_count / p.attempted_count) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Section */}
        <section className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {recentSessions.length === 0 ? (
            <p>No recent test sessions.</p>
          ) : (
            <ul className="divide-y">
              {recentSessions.map(s => (
                <li key={s.id} className="py-2 flex gap-3 items-center">
                  <span className="text-sm text-gray-500 w-32">{dayjs(s.end_time).format("DD MMM YYYY HH:mm")}</span>
                  <span className="font-medium">{s.modules?.module_name || "Module"}</span>
                  <span className="text-sm text-gray-700">Score: {s.score}</span>
                  <span className="text-xs text-gray-500">{s.question_count} Qs</span>
                </li>
              ))}
            </ul>
          )}
          {/* Chart of scores */}
          {recentSessions.length > 0 && (
            <div className="max-w-xl mt-6">
              <LineChart data={chartData} />
            </div>
          )}
        </section>

        {/* Exam Countdown */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-xl">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Next Exam Countdown</h2>
            <ExamCountdown targetDate="2025-12-06T08:00:00Z" />
          </div>
          <div className="flex-1 text-sm opacity-80">
            Keep up the pace—each session counts toward your goal!
          </div>
        </section>
      </div>
    </Layout>
  );
}

// --- Exam Countdown Helper ---
function ExamCountdown({ targetDate }) {
  const [daysLeft, setDaysLeft] = useState(() => dayjs(targetDate).diff(dayjs(), "day"));

  useEffect(() => {
    const id = setInterval(() => {
      setDaysLeft(dayjs(targetDate).diff(dayjs(), "day"));
    }, 86_400_000);
    return () => clearInterval(id);
  }, [targetDate]);

  return <p className="text-4xl font-semibold">{daysLeft} days</p>;
}
