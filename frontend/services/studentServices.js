import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/students`
  : "http://127.0.0.1:5000/students";

export const studentService = {
  // GET /students/ - Get all students
  getStudents: async () => {
    return fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // GET /classes/ - Get available classes for dropdown
  getClasses: async () => {
    const classesUrl = BASE_URL
      ? `${BASE_URL}/classes`
      : "http://127.0.0.1:5000/classes";
    return fetch(`${classesUrl}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // GET /students/<rollno> - Get student details & attendance stats
  getStudentByRollNo: async (rollno) => {
    return fetch(`${API_URL}/${rollno}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // POST /students/create - Create student with multipart photo upload
  saveStudent: async (formDataObj) => {
    return fetch(`${API_URL}/create`, {
      method: "POST",
      body: formDataObj, // Note: Browser sets multipart header and boundary automatically
    }).then(handleResponse);
  },

  // PUT /students/ - Update student details via JSON
  updateStudent: async (payload) => {
    return fetch(`${API_URL}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },

  // DELETE /students/ - Delete student record
  deleteStudent: async (rollno) => {
    return fetch(`${API_URL}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollno }),
    }).then(handleResponse);
  },
};
