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
    const body =
      typeof payload === "string" ? { camera_source: payload } : { ...payload };

    return fetch(`${API_URL}/${encodeURIComponent(classId)}/camera-source`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
  createClass: async (className, cameraSource = "0") => {
    return fetch(`${API_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        class_name: className,
        camera_source: cameraSource || "0",
      }),
    }).then(handleResponse);
  },

  // PUT /classes/ -> Update class name and optionally its camera source
  updateClass: async (oldClassName, newClassName, cameraSource) => {
    const payload = {
      class_name: oldClassName,
      new_class_name: newClassName,
    };

    if (cameraSource !== undefined) {
      payload.camera_source = cameraSource || "0";
    }

    return fetch(`${API_URL}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
