// services/studentServices.js
import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL || "http://localhost:5000";

export const studentService = {
  getStudents: async () => {
    return fetch(`${API_URL}/students`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  saveStudent: async (payload, imageFile) => {
    let bodyData;
    let headers = {};

    if (imageFile) {
      const data = new FormData();
      data.append("studentData", JSON.stringify(payload));
      data.append("avatar", imageFile);
      bodyData = data;
    } else {
      bodyData = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    return fetch(`${API_URL}/students`, {
      method: "POST",
      headers: headers,
      body: bodyData,
    }).then(handleResponse);
  },

  // Update an existing student's details
  updateStudent: async (studentId, payload, imageFile) => {
    let bodyData;
    let headers = {};

    if (imageFile) {
      const data = new FormData();
      data.append("studentData", JSON.stringify(payload));
      data.append("avatar", imageFile);
      bodyData = data;
    } else {
      bodyData = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    return fetch(`${API_URL}/students/${studentId}`, {
      method: "PUT",
      headers: headers,
      body: bodyData,
    }).then(handleResponse);
  },

  deleteStudent: async (studentId) => {
    return fetch(`${API_URL}/students/${studentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },
};
