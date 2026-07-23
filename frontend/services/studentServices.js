import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/students`
  : "http://127.0.0.1:5000/students";

export const studentService = {
  // GET / -> Fetch all students
  getStudents: async () => {
    return fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // GET /classes -> Fetch dynamic classes list for the dropdown
  getClasses: async () => {
    const classesUrl = BASE_URL
      ? `${BASE_URL}/classes`
      : "http://127.0.0.1:5000/classes";
    return fetch(`${classesUrl}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // GET /<rollno> -> Fetch single student
  getStudentByRollNo: async (rollno) => {
    return fetch(`${API_URL}/${rollno}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // POST /create -> Create student
  saveStudent: async (payload) => {
    return fetch(`${API_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },

  // PUT / -> Update student profile
  updateStudent: async (payload) => {
    return fetch(`${API_URL}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },

  // DELETE / -> Delete student
  deleteStudent: async (rollno) => {
    return fetch(`${API_URL}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollno }),
    }).then(handleResponse);
  },
};
