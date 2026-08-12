import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/timetable`
  : "http://127.0.0.1:5000/timetable";

export const timetableService = {
  // GET /timetable/<class_name>
  getTimetableByClass: async (className) => {
    const encodedClass = encodeURIComponent(className);
    return fetch(`${API_URL}/${encodedClass}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // POST /timetable/<class_name>/create
  createPeriod: async (className, payload) => {
    const encodedClass = encodeURIComponent(className);
    return fetch(`${API_URL}/${encodedClass}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        class_name: payload.class_name || className,
        subject_code: payload.subject_code,
        day_of_week: payload.day_of_week,
        start_time: payload.start_time,
        end_time: payload.end_time,
      }),
    }).then(handleResponse);
  },

  // PUT /timetable/<class_name>
  updatePeriod: async (className, payload) => {
    const encodedClass = encodeURIComponent(className);
    return fetch(`${API_URL}/${encodedClass}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timetable_id: String(payload.timetable_id),
        subject_code: payload.subject_code,
      }),
    }).then(handleResponse);
  },

  // DELETE /timetable/<class_name>
  deletePeriod: async (className, timetableId) => {
    const encodedClass = encodeURIComponent(className);
    return fetch(`${API_URL}/${encodedClass}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timetable_id: String(timetableId),
      }),
    }).then(handleResponse);
  },
};
