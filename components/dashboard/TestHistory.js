import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabaseModules } from "../../lib/supabaseClient.js";
import { Trash2 } from "lucide-react";
                

export default function TestHistory() {
  const { data: session, status } = useSession();
  const [tests, setTests] = useState([]);
  const [expandedTest, setExpandedTest] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchTests = async () => {
      const { data: testSessions } = await supabaseModules
        .from("test_sessions")
        .select("id, module_id, score, question_count, time_spent, start_time, modules(module_name)")
        .eq("user_id", session.user.id)
        .order("start_time", { ascending: false });

      if (!testSessions) {
        setTests([]);
        return;
      }

      const testIds = testSessions.map(t => t.id);
      const { data: allAnswers } = await supabaseModules
        .from("test_answers")
        .select("id, test_session_id, is_correct")
        .in("test_session_id", testIds);

      const correctCounts = {};
      (allAnswers || []).forEach(ans => {
        if (ans.is_correct) {
          correctCounts[ans.test_session_id] = (correctCounts[ans.test_session_id] || 0) + 1;
        }
      });

      const mappedTests = testSessions.map(test => {
        const correct = correctCounts[test.id] || 0;
        const total = test.question_count || "?";
        const timeStr = test.time_spent
          ? `${Math.floor(test.time_spent / 60)} min ${test.time_spent % 60} sec`
          : "N/A";
        return {
          ...test,
          module_name: test.modules?.module_name || "Module",
          correct_answers: `${correct} out of ${total}`,
          time_spent: timeStr,
        };
      });

      setTests(mappedTests);
    };
    fetchTests();
  }, [session?.user?.id]);

  const toggleTestDetails = (testId) =>
    setExpandedTest(expandedTest === testId ? null : testId);

  const deleteTest = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      await supabaseModules.from("test_answers").delete().eq("test_session_id", testId);
      await supabaseModules.from("test_sessions").delete().eq("id", testId);
      setTests(tests.filter((test) => test.id !== testId));
    }
  };

  if (status === "loading") return <div>Loading test history…</div>;
  if (!session) return <div>Please sign in to see your test history.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Test History</h3>
      <div className="divide-y">
        {tests.length === 0 && <div className="text-gray-400 py-4">No test sessions found.</div>}
        {tests.map((test) => (
          <div key={test.id} className="py-4">
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
              onClick={() => toggleTestDetails(test.id)}
            >
              <span className="text-lg font-semibold text-gray-800">
                {test.module_name}{" "}
                <span className="text-gray-500 text-sm">
                  ({new Date(test.start_time).toLocaleDateString()})
                </span>
              </span>
              <span className="text-gray-500">{expandedTest === test.id ? "▲" : "▼"}</span>
            </div>

            {expandedTest === test.id && (
              <div className="mt-3 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Score:</strong>{" "}
                    <span
                      className={`ml-2 font-semibold ${
                        test.score < 50
                          ? "text-red-600"
                          : test.score < 75
                          ? "text-yellow-500"
                          : "text-green-600"
                      }`}
                    >
                      {test.score}%
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Correct Answers:</strong> {test.correct_answers}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Time Spent:</strong> {test.time_spent}
                  </p>
                </div>

                <button
                onClick={() => deleteTest(test.id)}
                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                title="Delete Test"
                >
                <Trash2 className="w-5 h-5" />
                </button>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
