import { useEffect, useState } from "react";
import { supabaseAuth } from "../lib/supabaseClient";
import dayjs from "dayjs";

export default function NavbarExamCountdown({ userId }) {
  const [examDate, setExamDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  // Fetch the user's next_exam_date
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data, error } = await supabaseAuth
        .from("profiles")
        .select("next_exam_date")
        .eq("id", userId)
        .single();
      if (error) {
        setExamDate(null);
        return;
      }
      setExamDate(data?.next_exam_date);
    })();
  }, [userId]);

  // Update countdown
  useEffect(() => {
    if (!examDate) {
      setDaysLeft(null);
      return;
    }
    const update = () => {
      setDaysLeft(dayjs(examDate).diff(dayjs(), "day"));
    };
    update();
    const id = setInterval(update, 60 * 60 * 1000); // update every hour
    return () => clearInterval(id);
  }, [examDate]);

  // Don't render if no exam date is set
  if (!examDate || daysLeft == null) return null;

  return (
    <span className="text-white font-semibold tracking-wide">
      Your Next Exam: <span className="text-white ml-1">{daysLeft} day{daysLeft === 1 ? "" : "s"}</span>
    </span>
  );
}
