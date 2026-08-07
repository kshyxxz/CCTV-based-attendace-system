import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Students from "../features/students/Students";
import Dashboard from "../features/dashboard/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import LiveRecognition from "../features/recognition/LiveRecognition";
import Attendance from "../features/attendance/Attendance";
import Timetable from "../features/timetable/Timetable";
import Subjects from "../features/subjects/Subjects";
import Classes from "../features/classes/Classes";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/students" element={<Students />} />
          <Route path="/students/create" element={<Students />} />
          <Route path="/students/:rollno" element={<Students />} />

          <Route path="/recognition" element={<LiveRecognition />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/create" element={<Subjects />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/timetable/:className" element={<Timetable />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/create" element={<Classes />} />
        </Route>

        {/* Direct Global Catch Redirect Fallback Route rule to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
