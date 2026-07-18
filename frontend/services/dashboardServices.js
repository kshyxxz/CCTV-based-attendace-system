// services/dashboardServices.js
import { BASE_URL, handleResponse } from "./api";

// Fallback to local port if base url isn't globally declared
const API_URL = BASE_URL || "http://localhost:5000";

export const dashboardService = {
  // Fetch overall stat counters (Total, Present, Absent, Rate)
  getStats: async () => {
    return fetch(`${API_URL}/stats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(handleResponse)
      .then((data) => (Array.isArray(data) ? data[0] : data)); // Extracts the object if wrapped in a json-server array
  },

  // Fetch recent check-in attendance logs
  getRecentLogs: async () => {
    return fetch(`${API_URL}/recent`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // Fetch chart data trend numbers
  getAnalyticsData: async () => {
    return fetch(`${API_URL}/analytics`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(handleResponse)
      .then((data) => (Array.isArray(data) ? data[0].data : data)); // Extracts the pure trend array safely
  },
};
