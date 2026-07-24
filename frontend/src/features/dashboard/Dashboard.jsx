//Dashboard.jsx
import { useState, useEffect } from "react";
import DashboardCards from "./DashboardCards";
import AttendanceChart from "./AttendanceChart";
import { apiService } from "../../../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    attendanceRate: "0%",
    totalRecords: 0,
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [chartMetrics, setChartMetrics] = useState([0, 0, 0, 0, 0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setApiError("");

        // Call the centralized API client
        const data = await apiService.getDashboardSummary();
        console.log("Dashboard fetch result:", data);

        setStats({
          totalStudents: data.stats?.totalStudents || 0,
          presentToday: data.stats?.presentToday || 0,
          attendanceRate: data.stats?.attendanceRate || "0%",
          totalRecords: data.stats?.totalRecords || 0,
        });
        setAttendanceRecords(data.recentAttendance || []);
        setChartMetrics(data.chartData || [0, 0, 0, 0, 0, 0]);
      } catch (error) {
        console.error("API communication failed:", error);
        setApiError(
          "Failed to load dashboard data. Connecting to backend failed.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          fontFamily: "Poppins",
        }}
      >
        <h2>Loading Dashboard Metrics...</h2>
      </div>
    );
  }

  return (
    <div className="main">
      <header className="navbar">
        <div className="title">
          <h1>Dashboard</h1>
          <p>Welcome to Face Recognition Attendance System</p>
        </div>
      </header>

      {apiError && (
        <div
          style={{
            background: "#fee2e2",
            color: "#ef4444",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
            fontWeight: "500",
          }}
        >
          {apiError}
        </div>
      )}

      <DashboardCards stats={stats} />

      <section className="content">
        <AttendanceChart chartMetrics={chartMetrics} />

        <div className="table-box">
          <h2>Recent Attendance</h2>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Date</th>
                <th>Day</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", color: "#64748b" }}
                  >
                    No attendance logs loaded for today.
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.rollNo}</td>
                    <td>{record.date}</td>
                    <td>{record.day}</td>
                    <td>{record.subject}</td>
                    <td>
                      <span
                        className={`status-badge ${record.status.toLowerCase()}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
