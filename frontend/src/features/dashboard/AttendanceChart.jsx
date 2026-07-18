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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function AttendanceChart({ chartMetrics }) {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sun"],
    datasets: [
      {
        label: "Attendance Rate %",
        data: chartMetrics,
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

  return (
    <div className="chart-box">
      <h2>Attendance Trend</h2>
      <div style={{ height: "250px", position: "relative" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default AttendanceChart;
