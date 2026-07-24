import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/classes`
  : "http://127.0.0.1:5000/classes";

export const classService = {
  // GET / -> Get all classes
  getClasses: async () => {
    return fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // POST / -> Create class
  createClass: async (className) => {
    return fetch(`${API_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class_name: className }),
    }).then(handleResponse);
  },

  // PUT / -> Update class name
  updateClass: async (oldClassName, newClassName) => {
    return fetch(`${API_URL}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        class_name: oldClassName,
        new_class_name: newClassName,
      }),
    }).then(handleResponse);
  },

  // DELETE / -> Delete class
  deleteClass: async (className) => {
    return fetch(`${API_URL}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class_name: className }),
    }).then(handleResponse);
  },
};
