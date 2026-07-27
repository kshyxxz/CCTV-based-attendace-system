import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/students`
  : "http://127.0.0.1:5000/students";

export const studentService = {
  getStudents: async () => {
    return fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  getClasses: async () => {
    const classesUrl = BASE_URL
      ? `${BASE_URL}/classes`
      : "http://127.0.0.1:5000/classes";
    return fetch(`${classesUrl}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  getStudentByRollNo: async (rollno) => {
    return fetch(`${API_URL}/${rollno}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // UPDATED: Sends FormData for multipart/form-data compatibility
  saveStudent: async (formDataObj) => {
    return fetch(`${API_URL}/create`, {
      method: "POST",
      // Note: Do NOT set 'Content-Type': 'multipart/form-data' header manually.
      // fetch() automatically generates the correct boundary string when given a FormData body.
      body: formDataObj,
    }).then(handleResponse);
  },

  // PUT still expects JSON according to your Flask code
  updateStudent: async (payload) => {
    return fetch(`${API_URL}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },

  deleteStudent: async (rollno) => {
    return fetch(`${API_URL}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollno }),
    }).then(handleResponse);
  },
};
