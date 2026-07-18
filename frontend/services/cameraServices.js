// services/cameraServices.js
import { BASE_URL, handleResponse } from "./api";

export const cameraService = {
  // Fetch current recognition session logs & stats
  getSessionData: async (camera, selectedClass) => {
    const params = new URLSearchParams({ camera, class: selectedClass });
    return fetch(`${BASE_URL}/attendance/live-session?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse);
  },

  // Toggle camera active state
  toggleCamera: async (camera, activeState) => {
    return fetch(`${BASE_URL}/camera/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ camera, active: activeState }),
    }).then(handleResponse);
  },

  // Trigger snapshot save
  captureSnapshot: async (camera) => {
    return fetch(`${BASE_URL}/camera/snapshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ camera }),
    }).then(handleResponse);
  },
};
