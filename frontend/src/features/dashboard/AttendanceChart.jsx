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

function AttendanceChart({ weeklyTrend }) {
  const labels = weeklyTrend.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  const chartDataPoints = weeklyTrend.map((item) =>
    Math.round((item.rate || 0) * 100),
  );

  const chartData = {
    labels: labels.length ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Attendance Rate %",
        data: chartDataPoints,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
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
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="chart-box">
      <h2>Weekly Attendance Trend</h2>
      <div style={{ height: "250px", position: "relative" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default AttendanceChart;
