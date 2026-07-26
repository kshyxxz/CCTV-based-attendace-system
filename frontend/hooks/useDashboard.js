import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardServices";

export function useDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    summary,
    loading,
    error,
    refreshDashboard: fetchDashboard,
  };
}
