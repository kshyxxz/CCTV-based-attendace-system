
export const BASE_URL = "http://localhost:5000";

export async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`,
    );
  }
  return response.json();
}

// The centralized API service your Dashboard and Students pages import
export const apiService = {
  // Pulls all backend routes for the dashboard and formats them into a single response object
  getDashboardSummary: async () => {
    try {
      const [statsArr, recentArr, chartArr] = await Promise.all([
        fetch(`${BASE_URL}/stats`).then(handleResponse),
        fetch(`${BASE_URL}/recentAttendance`).then(handleResponse),
        fetch(`${BASE_URL}/chartData`).then(handleResponse),
      ]);

      return {
        // Safe-guard: Extract first element if it's wrapped in a json-server array
        stats: Array.isArray(statsArr) ? statsArr[0] : statsArr,
        recentAttendance: recentArr || [],
        // Safe-guard: Extract metrics array from wrapping object
        chartData: Array.isArray(chartArr)
          ? chartArr[0]?.metrics || [0, 0, 0, 0, 0, 0]
          : chartArr?.metrics || [0, 0, 0, 0, 0, 0],
      };
    } catch (error) {
      console.error("Failed to compile dashboard summary details:", error);
      throw error;
    }
  },
};
