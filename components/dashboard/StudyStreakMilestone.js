import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabaseModules } from "../../lib/supabaseClient.js";
import dayjs from "dayjs";

export default function StudyStreakMilestoneSection() {
  const { data: session, status } = useSession();
  const [recentSessions, setRecentSessions] = useState([]);
  const [studyStreak, setStudyStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchSessions = async () => {
      setLoading(true);
      const { data: sessions } = await supabaseModules
        .from("test_sessions")
        .select("id, end_time")
        .eq("user_id", session.user.id)
        .order("end_time", { ascending: false })
        .limit(30); // optioneel, recentste 30
      setRecentSessions(sessions || []);
      setLoading(false);
    };

    fetchSessions();
  }, [session?.user?.id]);

  // Streak berekenen zodra recentSessions binnen zijn
  useEffect(() => {
    if (!recentSessions.length) {
      setStudyStreak(0);
      return;
    }
    // Unieke dagen uit sessions halen
    const uniqueDays = Array.from(
      new Set(recentSessions.map((s) => dayjs(s.end_time).format("YYYY-MM-DD")))
    ).sort((a, b) => dayjs(b).diff(dayjs(a)));

    let streak = 0;
    let prev = dayjs().startOf("day");
    for (let day of uniqueDays) {
      const current = dayjs(day);
      if (prev.diff(current, "day") === 0 || prev.diff(current, "day") === 1) {
        streak += 1;
        prev = current;
      } else {
        break;
      }
    }
    setStudyStreak(streak);
  }, [recentSessions]);

  if (status === "loading" || loading)
    return (
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 rounded-xl bg-green-100 p-4 shadow flex flex-col justify-center items-center min-h-[120px]">
          <h3 className="text-lg font-bold mb-1">🔥 Current Study Streak:</h3>
          <p>Loading…</p>
        </div>
        <div className="flex-1 rounded-xl bg-blue-100 p-4 shadow flex flex-col justify-center items-center min-h-[120px]">
          <h3 className="text-lg font-bold mb-1">🏆 Milestones</h3>
          <p>Loading…</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 rounded-xl bg-green-100 p-4 shadow flex flex-col justify-center items-center min-h-[120px]">
        <h3 className="text-lg font-bold mb-1">🔥 Current Study Streak:</h3>
        <p>{studyStreak} days</p>
      </div>
      <div className="flex-1 rounded-xl bg-blue-100 p-4 shadow flex flex-col justify-center items-center min-h-[120px]">
        <h3 className="text-lg font-bold mb-1">🏆 Milestones</h3>
        <ul className="list-disc ml-5">
          {studyStreak >= 7 && <li>1 week streak!</li>}
          {recentSessions.length >= 10 && <li>Completed 10 study sessions!</li>}
          {studyStreak < 7 && recentSessions.length < 10 && (
            <li className="text-gray-400">No milestones yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}
