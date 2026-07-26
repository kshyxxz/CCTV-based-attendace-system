import { useDashboard } from "../../../hooks/useDashboard";
import DashboardCards from "./DashboardCards";
import AttendanceChart from "./AttendanceChart";
import "./Dashboard.css";

function Dashboard() {
  const { summary, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Dashboard Metrics...</h2>
      </div>
    );
  }

  const todayData = summary?.today || {
    present: 0,
    absent: 0,
    attendance_rate: 0,
  };
  const weeklyTrend = summary?.weekly_trend || [];
  const subjectDistribution = summary?.subject_distribution || [];

  return (
    <div className="main">
      <header className="navbar">
        <div className="title">
          <h1>Dashboard</h1>
          <p>Welcome to Face Recognition Attendance System</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <DashboardCards today={todayData} />

      <section className="content">
        <AttendanceChart weeklyTrend={weeklyTrend} />

        <div className="table-box">
          <h2>Subject Distribution</h2>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th className="text-right">Student Count</th>
              </tr>
            </thead>
            <tbody>
              {subjectDistribution.length === 0 ? (
                <tr>
                  <td colSpan="2" className="empty-table-text">
                    No subject data available.
                  </td>
                </tr>
              ) : (
                subjectDistribution.map((item, index) => (
                  <tr key={index}>
                    <td className="subject-name">{item.subject}</td>
                    <td className="text-right font-semibold">{item.count}</td>
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
