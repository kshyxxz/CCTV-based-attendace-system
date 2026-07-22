// hooks/useCamera.js
import { useState, useEffect } from "react";
import { cameraService } from "../services/cameraServices";

export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCamera] = useState("Main Hall Cam 1");
  const [selectedClass] = useState("AI & ML");
  const [recognitionLogs, setRecognitionLogs] = useState([]);
  const [stats, setStats] = useState({
    detected: 0,
    recognized: 0,
    unknown: 0,
    fps: 0,
  });

  // Fetch initial session logs and metrics
  useEffect(() => {
    const fetchCurrentSessionData = async () => {
      try {
        const data = await cameraService.getSessionData(
          selectedCamera,
          selectedClass,
        );
        setRecognitionLogs(data.logs || []);
        setStats(
          data.stats || { detected: 0, recognized: 0, unknown: 0, fps: 0 },
        );
      } catch (error) {
        console.error("Error fetching live session data:", error);

        // Mock data fallback if backend is offline
        setRecognitionLogs([]);
        setStats({ detected: 3, recognized: 2, unknown: 1, fps: 0 });
      }
    };

    fetchCurrentSessionData();
  }, [selectedCamera, selectedClass]);

  // Handle active stream loop / WebSocket triggers
  useEffect(() => {
    if (!isCameraActive) {
      setStats((prev) => ({ ...prev, fps: 0 }));
      return;
    }

    // Simulated active feed frame refresh updates
    setStats((prev) => ({ ...prev, fps: 30, detected: 6, recognized: 5 }));
  }, [isCameraActive]);

  const handleStartCamera = async () => {
    try {
      const nextState = !isCameraActive;
      await cameraService.toggleCamera(selectedCamera, nextState);
      setIsCameraActive(nextState);
    } catch (error) {
      console.error("Failed to toggle system camera state:", error);
      setIsCameraActive(!isCameraActive); // Fallback toggle to test frontend offline
    }
  };

  const handleCaptureSnapshot = async () => {
    try {
      await cameraService.captureSnapshot(selectedCamera);
      alert("Snapshot event triggered and saved via API.");
    } catch (error) {
      console.error("Error capturing snapshot:", error);
    }
  };

  return {
    isCameraActive,
    searchQuery,
    setSearchQuery,
    selectedCamera,
    selectedClass,
    recognitionLogs,
    stats,
    handleStartCamera,
    handleCaptureSnapshot,
  };
}
