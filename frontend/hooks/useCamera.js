import { useState, useRef, useEffect } from "react";

const BACKEND = "http://localhost:5000";

export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCamera] = useState("Main Hall Cam 1");
  const [selectedClass] = useState("");
  const [recognitionLogs, setRecognitionLogs] = useState([]);
  const [stats, setStats] = useState({
    detected: 0,
    recognized: 0,
    unknown: 0,
    fps: 0,
  });
  const [detections, setDetections] = useState([]);

  // kept so CameraPanel's prop signature stays unchanged
  const videoRef = useRef(null);

  const clearRecognitionLogs = () => {
    setRecognitionLogs([]);
  };

  // Poll real-time stream stats and logs from the backend
  useEffect(() => {
    let intervalId;
    if (isCameraActive) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`${BACKEND}/recognition/state`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setStats(data.stats);
              setRecognitionLogs(data.logs);
            }
          }
        } catch (err) {
          console.error("[useCamera] Error polling stream state:", err);
        }
      }, 1000);
    } else {
      setStats({ detected: 0, recognized: 0, unknown: 0, fps: 0 });
      setDetections([]);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCameraActive]);

  const handleStartCamera = async () => {
    if (!isCameraActive) {
      // Tell the backend to open the camera
      try {
        await fetch(`${BACKEND}/recognition/stream/start`, { method: "POST" });
      } catch (err) {
        console.error("[useCamera] Could not reach backend:", err);
      }
      setIsCameraActive(true);
    } else {
      // Tell the backend to stop the camera
      try {
        await fetch(`${BACKEND}/recognition/stream/stop`);
      } catch (err) {
        console.error("[useCamera] Could not reach backend:", err);
      }
      setIsCameraActive(false);
      // Reset stats when stopped
      setStats({ detected: 0, recognized: 0, unknown: 0, fps: 0 });
      setDetections([]);
    }
  };

  // Snapshot: open the MJPEG feed URL in a new tab so the user can save it
  const handleCaptureSnapshot = () => {
    if (!isCameraActive) return;
    window.open(`${BACKEND}/recognition/video_feed`, "_blank");
  };

  return {
    isCameraActive,
    searchQuery,
    setSearchQuery,
    selectedCamera,
    selectedClass,
    recognitionLogs,
    stats,
    detections,
    handleStartCamera,
    handleCaptureSnapshot,
    videoRef,
    clearRecognitionLogs,
  };
}

