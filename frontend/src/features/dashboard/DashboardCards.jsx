import { FaUserCheck, FaUserTimes, FaChartPie, FaUsers } from "react-icons/fa";

function DashboardCards({ today }) {
  const present = today?.present || 0;
  const absent = today?.absent || 0;
  const total = present + absent;
  const attendanceRate = `${Math.round(today?.attendance_rate || 0)}%`;

  return (
    <section className="cards">
      <div className="card">
        <div>
          <h3>Total Expected</h3>
          <h1>{total}</h1>
        </div>
        <FaUsers />
      </div>

      <div className="card">
        <div>
          <h3>Present Today</h3>
          <h1>{present}</h1>
        </div>
        <FaUserCheck />
      </div>

      <div className="card">
        <div>
          <h3>Absent Today</h3>
          <h1>{absent}</h1>
        </div>
        <FaUserTimes />
      </div>

      <div className="card">
        <div>
          <h3>Attendance Rate</h3>
          <h1>{attendanceRate}</h1>
        </div>
        <FaChartPie />
      </div>
    </section>
  );
}

export default DashboardCards;
