import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/dashboard`
  : "http://127.0.0.1:5000/dashboard";

export const dashboardService = {
  getSummary: async () => {
    return fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },
};
