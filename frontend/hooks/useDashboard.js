// hooks/useDashboard.js
import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardServices";

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required dashboard pieces concurrently
      const [statsData, logsData, analyticsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentLogs(),
        dashboardService.getAnalyticsData(),
      ]);

      setStats(statsData || null);
      setRecentLogs(logsData || []);
      setAnalytics(analyticsData || []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  // Run automatically when the dashboard element mounts
  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    stats,
    recentLogs,
    analytics,
    loading,
    error,
    refreshDashboard: loadDashboardData, // Allows manual pulling or refresh actions
  };
}
