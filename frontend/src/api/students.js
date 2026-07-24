// Simple helper to fetch students. Uses proxy in vite.config.js so '/students' works in dev.

const BASE = window.__STUDENTS_API_BASE__ || ""; // empty -> use proxy

export async function fetchStudents() {
  const url = BASE + "/students";
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchStudent(rollno) {
  const url = BASE + `/students/${encodeURIComponent(rollno)}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
