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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function AttendanceChart({ weeklyTrend = [] }) {
  // Format labels from incoming data
  const labels = weeklyTrend.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "UTC",
    });
  });

  // Scale 0-1 values to percentage integers (0-100)
  const chartDataPoints = weeklyTrend.map((item) => {
    const val = typeof item.rate === "number" ? item.rate : 0;
    return Math.round(val > 1 ? val : val * 100); // Handles both 0.85 and 85 inputs safely
  });

  const chartData = {
    labels: labels.length ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Attendance Rate",
        data: labels.length ? chartDataPoints : [0, 0, 0, 0, 0],
        borderColor: "#2563eb",
        borderWidth: 2,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(37, 99, 235, 0.25)");
          gradient.addColorStop(1, "rgba(37, 99, 235, 0.0)");
          return gradient;
        },
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
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
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
        },
        offset: true, // Prevents points from sticking to the wall edges
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: "#6b7280",
          font: { size: 12 },
          callback: (value) => `${value}%`,
        },
        grid: {
          color: "#f3f4f6",
        },
      },
    },
  };

  return (
    <div className="chart-box">
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#1e293b",
          marginBottom: "1rem",
        }}
      >
        Weekly Attendance Trend
      </h2>
      <div style={{ height: "250px", position: "relative" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default AttendanceChart;
