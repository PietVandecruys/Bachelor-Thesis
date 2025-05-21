import { useEffect, useState } from "react";
import { supabaseAuth } from "../lib/supabaseClient";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function NavbarExamCountdown({ userId }) {
  const [examDate, setExamDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

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

  useEffect(() => {
    if (!examDate) {
      setDaysLeft(null);
      return;
    }
    const update = () => {
      // Detect format
      let exam;
      if (/^\d{2}-\d{2}-\d{4}$/.test(examDate)) {
        exam = dayjs.utc(examDate, "DD-MM-YYYY");
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(examDate)) {
        exam = dayjs.utc(examDate, "YYYY-MM-DD");
      } else {
        exam = dayjs.utc(examDate);
      }
      if (!exam.isValid()) {
        setDaysLeft(null);
        return;
      }
      // Ignore the hour/minute part!
      const today = dayjs.utc().startOf("day");
      const examDay = exam.startOf("day");
      setDaysLeft(examDay.diff(today, "day"));
    };
    update();
    const id = setInterval(update, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [examDate]);

  if (!examDate || daysLeft == null) return null;
  if (daysLeft < 0) return null;

  let countdownLabel = "";
  if (daysLeft === 0) {
    countdownLabel = "Today";
  } else if (daysLeft === 1) {
    countdownLabel = "Tomorrow";
  } else {
    countdownLabel = `${daysLeft} days`;
  }

  return (
    <span className="text-white font-semibold tracking-wide">
      Your Next Exam: <span className="text-white ml-1">{countdownLabel}</span>
    </span>
  );
}
