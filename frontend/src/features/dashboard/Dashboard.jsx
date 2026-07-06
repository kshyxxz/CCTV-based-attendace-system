import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaUserGraduate,
  FaHouseUser,
  FaUsers,
  FaCalendarCheck,
  FaSignOutAlt,
  FaBell,
  FaUserCheck,
  FaChartPie,
  FaDatabase,
} from "react-icons/fa";
import "./dashboard.css"; // Ensure this matches your CSS filename case exactly

// Register Chart.js structures globally for React
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function Dashboard() {
  // 1. Operational states for data management, loading indicators, and errors
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    attendanceRate: "0%",
    totalRecords: 0,
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [chartMetrics, setChartMetrics] = useState([0, 0, 0, 0, 0, 0]); // Stores daily historical array
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // 2. Fetch data from REST API when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setApiError("");

        // Replace this URL string with your actual deployed server route
        const response = await fetch(
          "http://localhost:5000/api/v1/dashboard-summary",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Optional: Uncomment below if your API requires a token authentication layer
              // "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Server returned error status code: ${response.status}`,
          );
        }

        const data = await response.json();

        // 3. Update React states with real REST API JSON data
        setStats({
          totalStudents: data.stats.totalStudents || 0,
          presentToday: data.stats.presentToday || 0,
          attendanceRate: data.stats.attendanceRate || "0%",
          totalRecords: data.stats.totalRecords || 0,
        });
        setAttendanceRecords(data.recentAttendance || []);
        setChartMetrics(data.chartData || [0, 0, 0, 0, 0, 0]);
      } catch (error) {
        console.error("REST API communication failed:", error);
        setApiError(
          "Failed to load dashboard data. Connecting to backend failed.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 4. Dynamic Chart configuration using state data
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sun"],
    datasets: [
      {
        label: "Attendance Rate %",
        data: chartMetrics, // Uses state variable directly from the server response
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // 5. Render a clean loading UI block while waiting for the network response
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Poppins",
        }}
      >
        <h2>Loading Dashboard Metrics...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Sidebar Panel Layout */}
      <aside className="sidebar">
        <div className="logo">
          <FaUserGraduate />
          <h2>FaceAttend</h2>
        </div>

        <ul>
          <li className="active">
            <FaHouseUser />
            <span>Dashboard</span>
          </li>
          <li>
            <Link to="/students">
              <FaUsers />
              <span>Students</span>
            </Link>
          </li>
          <li>
            <Link to="/attendance">
              <FaCalendarCheck />
              <span>Attendance</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <FaSignOutAlt />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content Presentation window */}
      <main className="main">
        {/* Top Header Navbar */}
        <header className="navbar">
          <div className="title">
            <h1>Dashboard</h1>
            <p>Welcome to Face Recognition Attendance System</p>
          </div>

          <div className="profile">
            <img src="" alt="Admin Profile Avatar" />
          </div>
        </header>

        {/* Global Error Notice Bar if REST API fails */}
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

        {/* Informational counter grid KPI layout structure matrix cards */}
        <section className="cards">
          <div className="card">
            <div>
              <h3>Total Students</h3>
              <h1>{stats.totalStudents}</h1>
            </div>
            <FaUsers />
          </div>

          <div className="card">
            <div>
              <h3>Present Today</h3>
              <h1>{stats.presentToday}</h1>
            </div>
            <FaUserCheck />
          </div>

          <div className="card">
            <div>
              <h3>Attendance Rate</h3>
              <h1>{stats.attendanceRate}</h1>
            </div>
            <FaChartPie />
          </div>

          <div className="card">
            <div>
              <h3>Total Records</h3>
              <h1>{stats.totalRecords}</h1>
            </div>
            <FaDatabase />
          </div>
        </section>

        {/* Split analytics visualization and table data */}
        <section className="content">
          <div className="chart-box">
            <h2>Attendance Trend</h2>
            <div style={{ height: "250px", position: "relative" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

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
      </main>
    </div>
  );
}

export default Dashboard;
