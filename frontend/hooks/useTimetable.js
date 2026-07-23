import { useState, useEffect } from "react";
import { timetableService } from "../services/timetableServices";

export function useTimetable() {
  const [selectedClass, setSelectedClass] = useState("Grade 10 - A");
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await timetableService.getTimetableByClass(selectedClass);
      setSchedule(data || []);
    } catch (err) {
      // Mock timetable schedule matrix
      setSchedule([
        {
          time: "08:00-09:00",
          Monday: {
            subject: "Mathematics",
            teacher: "Mehta",
            color: "#38bdf8",
          },
          Tuesday: {
            subject: "English Literature",
            teacher: "Nair",
            color: "#f59e0b",
          },
          Wednesday: { subject: "Physics", teacher: "Kumar", color: "#a855f7" },
          Thursday: { subject: "History", teacher: "Menon", color: "#ec4899" },
          Friday: {
            subject: "Computer Science",
            teacher: "Iyer",
            color: "#38bdf8",
          },
        },
        {
          time: "09:00-10:00",
          Monday: { subject: "Physics", teacher: "Kumar", color: "#a855f7" },
          Tuesday: {
            subject: "Computer Science",
            teacher: "Iyer",
            color: "#38bdf8",
          },
          Wednesday: {
            subject: "Mathematics",
            teacher: "Mehta",
            color: "#38bdf8",
          },
          Thursday: {
            subject: "English Literature",
            teacher: "Nair",
            color: "#f59e0b",
          },
          Friday: { subject: "History", teacher: "Menon", color: "#ec4899" },
        },
        {
          time: "10:15-11:15",
          Monday: {
            subject: "English Literature",
            teacher: "Nair",
            color: "#f59e0b",
          },
          Tuesday: {
            subject: "Mathematics",
            teacher: "Mehta",
            color: "#38bdf8",
          },
          Wednesday: {
            subject: "Computer Science",
            teacher: "Iyer",
            color: "#38bdf8",
          },
          Thursday: { subject: "Physics", teacher: "Kumar", color: "#a855f7" },
          Friday: {
            subject: "Mathematics",
            teacher: "Mehta",
            color: "#38bdf8",
          },
        },
        {
          time: "11:15-12:15",
          Monday: {
            subject: "Computer Science",
            teacher: "Iyer",
            color: "#38bdf8",
          },
          Tuesday: { subject: "History", teacher: "Menon", color: "#ec4899" },
          Wednesday: {
            subject: "English Literature",
            teacher: "Nair",
            color: "#f59e0b",
          },
          Thursday: {
            subject: "Mathematics",
            teacher: "Mehta",
            color: "#38bdf8",
          },
          Friday: { subject: "Physics", teacher: "Kumar", color: "#a855f7" },
        },
        {
          time: "13:00-14:00",
          Monday: { subject: "History", teacher: "Menon", color: "#ec4899" },
          Tuesday: { subject: "Physics", teacher: "Kumar", color: "#a855f7" },
          Wednesday: {
            subject: "Mathematics",
            teacher: "Mehta",
            color: "#38bdf8",
          },
          Thursday: {
            subject: "Computer Science",
            teacher: "Iyer",
            color: "#38bdf8",
          },
          Friday: {
            subject: "English Literature",
            teacher: "Nair",
            color: "#f59e0b",
          },
        },
        {
          time: "14:00-15:00",
          Monday: {
            subject: "Mathematics",
            teacher: "Mehta",
            color: "#38bdf8",
          },
          Tuesday: {
            subject: "Computer Science",
            teacher: "Iyer",
            color: "#38bdf8",
          },
          Wednesday: { subject: "History", teacher: "Menon", color: "#ec4899" },
          Thursday: {
            subject: "English Literature",
            teacher: "Nair",
            color: "#f59e0b",
          },
          Friday: {
            subject: "Mathematics",
            teacher: "Mehta",
            color: "#38bdf8",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [selectedClass]);

  return { selectedClass, setSelectedClass, schedule, loading };
}
