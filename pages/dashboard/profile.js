import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabaseAuth, supabaseModules } from "../../lib/supabaseClient.js";
import Layout from "../../components/Layout.js";
import { Calendar as CalendarIcon, Edit2, Save } from "lucide-react";
import TestHistory from "../../components/dashboard/TestHistory.js";

export default function DashboardProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    preferences: {},
    next_exam_date: "",
    difficulty: "",
    cfa_level: "",
  });
  const [modules, setModules] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    (async () => {
      // Fetch profile including difficulty and cfa_level
      const { data: prof } = await supabaseAuth
        .from("profiles")
        .select("full_name, email, preferences, next_exam_date, difficulty, cfa_level")
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
          difficulty: prof.difficulty || "",
          cfa_level: prof.cfa_level || "",
        }));

      const { data: allModules } = await supabaseModules
        .from("modules")
        .select("id, module_name")
        .order("module_name", { ascending: true });
      setModules(allModules || []);
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
        difficulty: profile.difficulty || null,
        cfa_level: profile.cfa_level || null,
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
          {/* 6-field, symmetrical grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
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
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="border rounded px-3 py-2 w-full bg-gray-100 mt-1"
              />
            </div>
            {/* Preferred Difficulty Level */}
            <div>
              <label className="block text-sm font-medium">Preferred Difficulty Level</label>
              <select
                value={profile.difficulty || ""}
                onChange={e =>
                  setProfile({
                    ...profile,
                    difficulty: e.target.value,
                  })
                }
                disabled={!editing}
                className="border rounded px-3 py-2 w-full bg-white mt-1"
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {profile.difficulty && (
                <span className="text-xs text-gray-500">
                  Selected: {profile.difficulty.charAt(0).toUpperCase() + profile.difficulty.slice(1)}
                </span>
              )}
            </div>
            {/* CFA Level */}
            <div>
              <label className="block text-sm font-medium">CFA Level</label>
              <select
                value={profile.cfa_level || ""}
                onChange={e =>
                  setProfile({
                    ...profile,
                    cfa_level: e.target.value,
                  })
                }
                disabled={!editing}
                className="border rounded px-3 py-2 w-full bg-white mt-1"
              >
                <option value="">Select CFA Level</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
              </select>
              {profile.cfa_level && (
                <span className="text-xs text-gray-500">
                  Selected: Level {profile.cfa_level}
                </span>
              )}
            </div>
            {/* Next Exam Date */}
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
            {/* Preferred Module */}
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
        <div>
          <TestHistory />
        </div>
      </div>
    </Layout>
  );
}
