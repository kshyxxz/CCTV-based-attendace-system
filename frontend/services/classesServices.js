import { BASE_URL, handleResponse } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/classes`
  : "http://127.0.0.1:5000/classes";

export const classService = {
  // GET /classes/ -> Get all classes
  getClasses: async () => {
    return fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // GET /classes/ -> Resolve the selected class and its camera source
  getCameraSource: async (classId) => {
    const classes = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);

    const list = Array.isArray(classes) ? classes : classes?.classes || [];
    const match = list.find(
      (item) =>
        String(item.class_id ?? item.id ?? "") === String(classId) ||
        String(item.class_name ?? "") === String(classId),
    );

    return {
      class_id: match?.class_id ?? classId,
      camera_source: match?.camera_source ?? "",
    };
  },

  // PUT /classes/<class_id>/camera-source -> Create or update camera source
  setCameraSource: async (classId, payload) => {
    return fetch(`${API_URL}/${encodeURIComponent(classId)}/camera-source`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },

  // DELETE /classes/<class_id>/camera-source -> Remove camera source mapping
  deleteCameraSource: async (classId) => {
    return fetch(`${API_URL}/${encodeURIComponent(classId)}/camera-source`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // POST /classes/ -> Create class
  createClass: async (className) => {
    return fetch(`${API_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class_name: className }),
    }).then(handleResponse);
  },

  // PUT /classes/ -> Update class name
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

  // DELETE /classes/ -> Delete class
  deleteClass: async (className) => {
    return fetch(`${API_URL}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class_name: className }),
    }).then(handleResponse);
  },
};
