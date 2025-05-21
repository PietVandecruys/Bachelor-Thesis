import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabaseModules } from "../../lib/supabaseClient.js";

export default function ModuleProgressSection() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProgress = async () => {
      setLoading(true);

      // 1. Get all test sessions for the user
      const { data: allSessions } = await supabaseModules
        .from("test_sessions")
        .select("id, module_id, time_spent, question_count, modules(module_name)")
        .eq("user_id", session.user.id);

      if (!allSessions) {
        setProgress([]);
        setLoading(false);
        return;
      }

      // 2. Get all answers for the test sessions
      const sessionIds = allSessions.map((s) => s.id);
      const { data: allAnswers } = await supabaseModules
        .from("test_answers")
        .select("test_session_id, is_correct")
        .in("test_session_id", sessionIds);

      // 3. Stats per module
      const moduleStats = {};
      allSessions.forEach((session) => {
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
        const session = allSessions.find((s) => s.id === ans.test_session_id);
        if (!session) return;
        if (ans.is_correct && moduleStats[session.module_id]) {
          moduleStats[session.module_id].total_correct += 1;
        }
      });

      // 4. Make percentages
      const progressWithPercentages = Object.values(moduleStats).map((mod) => ({
        ...mod,
        percentage:
          mod.total_questions > 0
            ? (mod.total_correct / mod.total_questions) * 100
            : 0,
      }));

      setProgress(progressWithPercentages);
      setLoading(false);
    };

    fetchProgress();
  }, [session?.user?.id]);

  if (status === "loading" || loading)
    return (
      <div className="shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Module Progress</h2>
        <p>Loading progress...</p>
      </div>
    );

  return (
    <div className="shadow rounded-2xl p-6 mb-6">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Module Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {progress.length === 0 && <p>No progress yet.</p>}
        {progress.map((mod, idx) => (
          <div
            key={idx}
            className="bg-white bg-opacity-90 rounded-xl p-4 shadow space-y-2 text-gray-900"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">{mod.module_name}</span>
              <span className="text-sm font-semibold">
                {mod.percentage.toFixed(0)}%
              </span>
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
              <span>
                Total Time:{" "}
                <b>
                  {Math.floor(mod.total_time / 60)} min {mod.total_time % 60} sec
                </b>
              </span>
              <span>
                Questions: <b>{mod.total_questions}</b>
              </span>
              <span>
                Correct: <b>{mod.total_correct}</b>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
