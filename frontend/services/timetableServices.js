import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL || "http://127.0.0.1:5000";

export const timetableService = {
  getTimetableByClass: async (classId) => {
    return fetch(`${API_URL}/timetable?classId=${classId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },
};
