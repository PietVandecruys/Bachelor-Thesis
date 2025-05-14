import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabaseAuth, supabaseModules } from "../../lib/supabaseClient.js";
import Layout from "../../components/Layout.js";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, Edit2, Save } from "lucide-react";

export default function DashboardProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    preferences: {},
    next_exam_date: "",
  });
  const [modules, setModules] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recentSessions, setRecentSessions] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    (async () => {
      const { data: prof } = await supabaseAuth
        .from("profiles")
        .select("full_name, email, preferences, next_exam_date")
        .eq("id", session.user.id)
        .single();

      let preferencesObj = {};
      try {
        preferencesObj = prof?.preferences ? JSON.parse(prof.preferences) : {};
      } catch {
        preferencesObj = {};
      }

      if (prof)
        setProfile((p) => ({
          ...p,
          ...prof,
          preferences: preferencesObj,
          next_exam_date: prof.next_exam_date || "",
        }));

      const { data: allModules } = await supabaseModules
        .from("modules")
        .select("id, module_name")
        .order("module_name", { ascending: true });
      setModules(allModules || []);

      const { data: sessions } = await supabaseModules
        .from("test_sessions")
        .select("id, module_id, score, question_count, end_time, modules(module_name)")
        .eq("user_id", session.user.id)
        .order("end_time", { ascending: false })
        .limit(10);
      setRecentSessions(sessions || []);

      const { data: allSessions } = await supabaseModules
        .from("test_sessions")
        .select("module_id, time_spent, question_count, id, modules(module_name)")
        .eq("user_id", session.user.id);

      const { data: allAnswers } = await supabaseModules
        .from("test_answers")
        .select("test_session_id, is_correct")
        .eq("user_id", session.user.id);

      const moduleStats = {};
      (allSessions || []).forEach((session) => {
        const modId = session.module_id;
        if (!moduleStats[modId]) {
          moduleStats[modId] = {
            module_name: session.modules?.module_name || "Module",
            total_time: 0,
            total_questions: 0,
            total_correct: 0,
          };
        }
        moduleStats[modId].total_time += session.time_spent || 0;
        moduleStats[modId].total_questions += session.question_count || 0;
      });

      (allAnswers || []).forEach((ans) => {
        const session = (allSessions || []).find((s) => s.id === ans.test_session_id);
        if (!session) return;
        if (ans.is_correct && moduleStats[session.module_id]) {
          moduleStats[session.module_id].total_correct += 1;
        }
      });

      setProgress(Object.values(moduleStats));
    })();
  }, [status, session?.user?.id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabaseAuth
      .from("profiles")
      .update({
        full_name: profile.full_name,
        preferences: JSON.stringify(profile.preferences || {}),
        next_exam_date: profile.next_exam_date || null,
      })
      .eq("id", session.user.id);
    if (!error) setEditing(false);
    setSaving(false);
  };

  if (status === "loading") return <Layout>Loading…</Layout>;
  if (!session)
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="text-3xl font-semibold mb-4">Please sign in to view your dashboard.</h1>
        </div>
      </Layout>
    );

  const selectedModuleId = profile.preferences?.selected_module || "";
  const selectedModuleName = modules.find((m) => m.id === selectedModuleId)?.module_name || "";

  // For nice percentage bars
  const progressWithPercentages = progress.map((mod) => ({
    ...mod,
    percentage: mod.total_questions > 0 ? (mod.total_correct / mod.total_questions) * 100 : 0,
  }));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Profile Section */}
        <div className="bg-white shadow rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Profile Information</h2>
              <p className="text-gray-500 text-sm">Manage your personal information</p>
            </div>
            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
                editing
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
              disabled={saving}
            >
              {editing ? (
                <>
                  {saving ? "Saving…" : "Save"} <Save className="h-4 w-4" />
                </>
              ) : (
                <>
                  Edit <Edit2 className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Full name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                disabled={!editing}
                className="border rounded px-3 py-2 w-full bg-white mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="border rounded px-3 py-2 w-full bg-gray-100 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" /> Next Exam Date
              </label>
              <input
                type="date"
                value={profile.next_exam_date ? profile.next_exam_date.substring(0, 10) : ""}
                onChange={(e) => setProfile({ ...profile, next_exam_date: e.target.value })}
                disabled={!editing}
                className="border rounded px-3 py-2 w-full bg-white mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Preferred Module</label>
              <select
                value={selectedModuleId}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      selected_module: parseInt(e.target.value, 10),
                    },
                  })
                }
                disabled={!editing}
                className="border rounded px-3 py-2 w-full bg-white mt-1"
              >
                <option value="">Select a module</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.module_name}
                  </option>
                ))}
              </select>
              {selectedModuleName && (
                <span className="text-xs text-gray-500">Selected: {selectedModuleName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Module Progress Section */}
        <div className="shadow rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Module Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progress.length === 0 && <p>No progress yet.</p>}
            {progressWithPercentages.map((mod, idx) => (
              <div key={idx} className="bg-white bg-opacity-90 rounded-xl p-4 shadow space-y-2 text-gray-900">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">{mod.module_name}</span>
                  <span className="text-sm font-semibold">{mod.percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      mod.percentage >= 75
                        ? "bg-green-500"
                        : mod.percentage >= 50
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${mod.percentage}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span>Total Time: <b>{Math.floor(mod.total_time / 60)} min {mod.total_time % 60} sec</b></span>
                  <span>Questions: <b>{mod.total_questions}</b></span>
                  <span>Correct: <b>{mod.total_correct}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {recentSessions.length === 0 ? (
            <p>No recent test sessions.</p>
          ) : (
            <ul className="divide-y divide-blue-200/40">
              {recentSessions.map((s) => (
                <li key={s.id} className="py-2 flex gap-3 items-center">
                  <span className="text-sm w-32">{dayjs(s.end_time).format("DD MMM YYYY HH:mm")}</span>
                  <span className="font-medium">{s.modules?.module_name || "Module"}</span>
                  <span className="text-sm">Score: <b>{s.score}%</b></span>
                  <span className="text-xs">{s.question_count} Qs</span>
                </li>
              ))}
            </ul>
          )}
        </div>


      </div>
    </Layout>
  );
}
