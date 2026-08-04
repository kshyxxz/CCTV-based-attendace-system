import { BASE_URL } from "./api";

const API_URL = BASE_URL
  ? `${BASE_URL}/recognition`
  : "http://127.0.0.1:5000/recognition";

export const cameraService = {
  getStreamUrl(classId) {
    return `${API_URL}/video_feed?class_id=${encodeURIComponent(classId)}`;
  },
};
