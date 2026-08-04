import { useState, useRef, useEffect } from "react";
import { cameraService } from "../services/cameraServices";
import { classService } from "../services/classesServices";

const BACKEND = "http://localhost:5000";

export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classesList, setClassesList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [cameraSource, setCameraSource] = useState("");
  const [cameraSourceLoading, setCameraSourceLoading] = useState(false);
  const [cameraSourceError, setCameraSourceError] = useState(null);
  const [recognitionLogs, setRecognitionLogs] = useState([]);
  const [stats, setStats] = useState({
    detected: 0,
    recognized: 0,
    unknown: 0,
    fps: 0,
  });
  const [detections, setDetections] = useState([]);

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

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setCameraSourceLoading(true);
        const result = await classService.getClasses();
        const list = Array.isArray(result) ? result : result?.classes || [];
        setClassesList(list);

        setSelectedClassId((currentSelectedClassId) => {
          if (list.length === 0) {
            return "";
          }

          if (
            currentSelectedClassId &&
            list.some(
              (item) =>
                String(item.class_id ?? item.id ?? "") ===
                String(currentSelectedClassId),
            )
          ) {
            return currentSelectedClassId;
          }

          return String(list[0].class_id ?? list[0].id ?? "");
        });
      } catch (err) {
        console.error("[useCamera] Failed to load class list:", err);
        setClassesList([]);
        setSelectedClassId("");
      } finally {
        setCameraSourceLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      setCameraSource("");
      setCameraSourceError(null);
      return;
    }

    const selectedClass = classesList.find(
      (item) =>
        String(item.class_id ?? item.id ?? "") === String(selectedClassId),
    );

    if (selectedClass) {
      setCameraSource(selectedClass.camera_source || "");
      setCameraSourceError(null);
      return;
    }

    const fetchCameraSource = async () => {
      try {
        setCameraSourceLoading(true);
        setCameraSourceError(null);
        const result = await classService.getCameraSource(selectedClassId);
        setCameraSource(result.camera_source || "");
      } catch (err) {
        setCameraSource("");
        setCameraSourceError(
          err.message || "Unable to load class camera source.",
        );
      } finally {
        setCameraSourceLoading(false);
      }
    };

    fetchCameraSource();
  }, [selectedClassId, classesList]);

  const handleStartCamera = async () => {
    if (!selectedClassId) {
      alert("Please select a class before starting the camera.");
      return;
    }

    if (!cameraSource) {
      alert("Selected class does not have a camera source configured.");
      return;
    }

    if (!isCameraActive) {
      try {
        await fetch(
          `${BACKEND}/recognition/stream/start?class_id=${encodeURIComponent(
            selectedClassId,
          )}`,
          {
            method: "POST",
          },
        );
      } catch (err) {
        console.error("[useCamera] Could not reach backend:", err);
      }
      setIsCameraActive(true);
    } else {
      try {
        await fetch(`${BACKEND}/recognition/stream/stop`);
      } catch (err) {
        console.error("[useCamera] Could not reach backend:", err);
      }
      setIsCameraActive(false);
      setStats({ detected: 0, recognized: 0, unknown: 0, fps: 0 });
      setDetections([]);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!isCameraActive || !selectedClassId) return;
    window.open(
      `${BACKEND}/recognition/video_feed?class_id=${encodeURIComponent(
        selectedClassId,
      )}`,
      "_blank",
    );
  };

  const streamUrl =
    isCameraActive && selectedClassId
      ? cameraService.getStreamUrl(selectedClassId)
      : null;

  return {
    isCameraActive,
    searchQuery,
    setSearchQuery,
    classesList,
    selectedClassId,
    setSelectedClassId,
    cameraSource,
    cameraSourceLoading,
    cameraSourceError,
    recognitionLogs,
    stats,
    detections,
    handleStartCamera,
    handleCaptureSnapshot,
    streamUrl,
    videoRef,
    clearRecognitionLogs,
  };
}
