import { FaUsers, FaUserCheck, FaChartPie, FaDatabase } from "react-icons/fa";

function DashboardCards({ stats }) {
  return (
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
  );
}

export default DashboardCards;
