import { BASE_URL, handleResponse } from "./api";

export const attendanceService = {
  // Fetch attendance records with trailing slash to prevent CORS redirect errors
  getRecords: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.date) params.append("date", filters.date);
    if (filters.subject && filters.subject !== "All") {
      params.append("subject", filters.subject);
    }

    const queryString = params.toString();
    const url = `${BASE_URL}/attendance/${queryString ? `?${queryString}` : ""}`;

    return fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },
};
