import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Students from "../features/Students/Students"; // <-- Add this import statement right here
import Dashboard from "../features/dashboard/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import LiveRecognition from "../features/recognition/LiveRecognition";
import Attendance from "../features/attendance/Attendance";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Frame Nested Context System Wrapper */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* REPLACED PLACEHOLDER: Wired directly into your core features module */}
          <Route path="/students" element={<Students />} />

          <Route path="/recognition" element={<LiveRecognition />} />
          <Route path="/attendance" element={<Attendance />} />
          {/* Remaining sub-features placeholders */}
          <Route
            path="/live-attendance"
            element={
              <div style={{ padding: "32px" }}>
                <h2>Live Detection Camera Feed Grid</h2>
              </div>
            }
          />
          <Route
            path="/attendance"
            element={
              <div style={{ padding: "32px" }}>
                <h2>Attendance Search Logs Table</h2>
              </div>
            }
          />
        </Route>

        {/* Direct Global Catch Redirect Fallback Route rule to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
