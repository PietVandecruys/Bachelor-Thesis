import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabaseModules } from "../../lib/supabaseClient.js";
import { Trash2 } from "lucide-react";

export default function TestHistory() {
  const { data: session, status } = useSession();
  const [tests, setTests] = useState([]);
  const [expandedTest, setExpandedTest] = useState(null);
  const [testDetails, setTestDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(null);

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

  // Fetch details for a test
  const fetchTestDetails = async (testId) => {
    setLoadingDetails(testId);
    const { data: answers } = await supabaseModules
      .from("test_answers")
      .select(`
        id, selected_answer, is_correct,
        questions (
          question_text, answer_a, answer_b, answer_c, correct_answer, explanation
        )
      `)
      .eq("test_session_id", testId)
      .order("id", { ascending: true });
    setTestDetails((prev) => ({ ...prev, [testId]: answers || [] }));
    setLoadingDetails(null);
  };

  const toggleTestDetails = (testId) => {
    if (expandedTest === testId) {
      setExpandedTest(null);
    } else {
      setExpandedTest(testId);
      if (!testDetails[testId]) fetchTestDetails(testId);
    }
  };

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
            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
              <span
                className="text-lg font-semibold text-gray-800"
                onClick={() => toggleTestDetails(test.id)}
              >
                {test.module_name}{" "}
                <span className="text-gray-500 text-sm">
                  ({new Date(test.start_time).toLocaleDateString()})
                </span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
                  onClick={() => toggleTestDetails(test.id)}
                >
                  {expandedTest === test.id ? "Hide details" : "Details"}
                </button>
                <button
                  onClick={() => deleteTest(test.id)}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  title="Delete Test"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {expandedTest === test.id && (
              <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                <div className="mb-2">
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
                    <strong>Correct answers:</strong> {test.correct_answers}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Time spent:</strong> {test.time_spent}
                  </p>
                </div>
                {loadingDetails === test.id ? (
                  <div className="text-gray-400">Loading questions…</div>
                ) : (
                  <div className="space-y-4">
                    {(testDetails[test.id] || []).map((ans, idx) => (
                      <div key={ans.id} className="p-3 rounded bg-white shadow-sm">
                        <div className="font-semibold text-gray-800">
                          Question {idx + 1}: {ans.questions?.question_text}
                        </div>
                        <div className="text-sm mt-1">
                          <strong>Your answer:</strong>{" "}
                          <span className={ans.is_correct ? "text-green-600" : "text-red-600"}>
                            {ans.selected_answer}
                          </span>
                        </div>
                        <div className="text-sm">
                          <strong>Correct answer:</strong> {ans.questions?.correct_answer}
                        </div>
                        {ans.is_correct === false && (
                          <div className="text-xs text-gray-600">
                            <strong>Explanation:</strong> {ans.questions?.explanation}
                          </div>
                        )}
                        {/* Optionally show choices */}
                        <div className="text-xs mt-2 text-gray-500 flex gap-2">
                          <span>A) {ans.questions?.answer_a}</span>
                          <span>B) {ans.questions?.answer_b}</span>
                          <span>C) {ans.questions?.answer_c}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
