import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/subjects`
  : "http://127.0.0.1:5000/subjects";

export const subjectService = {
  // GET / -> Get all subjects
  getSubjects: async () => {
    return fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // POST / -> Create subject
  createSubject: async ({ subject_name, subject_code }) => {
    return fetch(`${API_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_name,
        subject_code,
      }),
    }).then(handleResponse);
  },

  // PUT / -> Update subject
  updateSubject: async ({ subject_id, new_subject_code, new_subject_name }) => {
    return fetch(`${API_URL}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_id: String(subject_id),
        new_subject_code,
        new_subject_name,
      }),
    }).then(handleResponse);
  },

  // DELETE / -> Delete subject
  deleteSubject: async (subject_id) => {
    return fetch(`${API_URL}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: String(subject_id) }),
    }).then(handleResponse);
  },
};
