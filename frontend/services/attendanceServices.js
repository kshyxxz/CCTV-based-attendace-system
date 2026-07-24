// services/attendanceServices.js
import { BASE_URL, handleResponse } from "./api";

export const attendanceService = {
  // Fetch paginated and filtered attendance logs
  getRecords: async (page, filters) => {
    const params = new URLSearchParams({
      page: page,
      limit: 10,
      date: filters.date,
      subject: filters.subject,
      status: filters.status,
      q: filters.search,
    });

    return fetch(`${BASE_URL}/attendance?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // Generates download or export endpoint URL
  getExportUrl: (format, filters) => {
    const params = new URLSearchParams({
      format,
      date: filters.date,
      subject: filters.subject,
      status: filters.status,
      q: filters.search,
    });
    return `${BASE_URL}/attendance/export?${params.toString()}`;
  },
};
