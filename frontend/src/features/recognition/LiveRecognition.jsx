import { useCamera } from "../../../hooks/useCamera";
import CameraPanel from "./CameraPanel";
import LiveFeedCard from "./LiveFeedCard";
import "./liverecognition.css";

function LiveRecognition() {
  const {
    isCameraActive,
    searchQuery = "",
    setSearchQuery,
    classesList,
    selectedClassId,
    setSelectedClassId,
    cameraSource,
    cameraSourceLoading,
    cameraSourceError,
    recognitionLogs = [],
    stats,
    detections,
    handleStartCamera,
    handleCaptureSnapshot,
    streamUrl,
    videoRef,
    clearRecognitionLogs,
  } = useCamera();

  const filteredLogs = recognitionLogs.filter(
    (log) =>
      (log.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.roll || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="live-recognition-container">
      <div className="live-header-row">
        <div>
          <h1 className="main-title">Live Attendance Monitoring</h1>
          <p className="system-description-text">
            Real-time CCTV face recognition attendance system
          </p>
        </div>
      </div>

      <div className="live-content-grid">
        <CameraPanel
          isCameraActive={isCameraActive}
          handleStartCamera={handleStartCamera}
          handleCaptureSnapshot={handleCaptureSnapshot}
          stats={stats}
          classesList={classesList}
          classLoading={cameraSourceLoading && !classesList.length}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
          cameraSource={cameraSource}
          cameraSourceLoading={cameraSourceLoading}
          cameraSourceError={cameraSourceError}
          streamUrl={streamUrl}
          videoRef={videoRef}
          detections={detections}
        />

        <LiveFeedCard
          recognitionLogs={recognitionLogs}
          filteredLogs={filteredLogs}
          clearRecognitionLogs={clearRecognitionLogs}
        />
      </div>
    </div>
  );
}

export default LiveRecognition;
