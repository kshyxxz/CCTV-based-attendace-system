// Made by Prashant
import { FaVideo, FaCamera, FaStop } from "react-icons/fa";

const BACKEND = "http://localhost:5000";

function CameraPanel({
  isCameraActive,
  handleStartCamera,
  handleCaptureSnapshot,
  stats,
  // videoRef and detections are kept in the prop signature for compatibility
  // but are no longer used — boxes are drawn server-side on the MJPEG stream
  videoRef,
  detections = [],
}) {
  return (
    <div className="video-panel">
      <div className="controls-panel">
        <div className="controls-left">
          <button
            className={`btn-action-trigger ${isCameraActive ? "btn-stop" : "btn-start"}`}
            onClick={handleStartCamera}
          >
            {isCameraActive ? <FaStop /> : <FaVideo />}
            <span>{isCameraActive ? "Stop Camera" : "Start Camera"}</span>
          </button>

          <button
            className="btn-action-trigger btn-snapshot"
            disabled={!isCameraActive}
            onClick={handleCaptureSnapshot}
          >
            <FaCamera />
            <span>Capture Snapshot</span>
          </button>
        </div>
      </div>

      <div
        className={`video-screen ${isCameraActive ? "active" : "offline"}`}
        style={{ position: "relative" }}
      >
        {/* MJPEG stream from backend — bounding boxes are burned in server-side */}
        {isCameraActive && (
          <img
            id="mjpeg-feed"
            src={`${BACKEND}/recognition/video_feed`}
            alt="Live camera feed"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {isCameraActive && (
          <div className="stream-live-indicator">
            <span className="live-dot"></span> LIVE
          </div>
        )}

        {!isCameraActive && (
          <div className="video-placeholder-offline">
            <FaCamera className="offline-camera-icon" />
            <h3>Camera is offline</h3>
            <p>Click &quot;Start Camera&quot; to begin recognition</p>
          </div>
        )}
      </div>

      <div className="stream-stats-grid">
        <div className="stat-card">
          <div className="stat-val primary">{stats.detected}</div>
          <div className="stat-lbl">Faces Detected</div>
        </div>
        <div className="stat-card">
          <div className="stat-val success">{stats.recognized}</div>
          <div className="stat-lbl">Recognized</div>
        </div>
        <div className="stat-card">
          <div className="stat-val warning">{stats.unknown}</div>
          <div className="stat-lbl">Unknown</div>
        </div>
        <div className="stat-card">
          <div className="stat-val info">{stats.fps}</div>
          <div className="stat-lbl">FPS</div>
        </div>
        <div className="stat-card">
          <div className={`stat-val ${isCameraActive ? "success" : "danger"}`}>
            {isCameraActive ? "ON" : "OFF"}
          </div>
          <div className="stat-lbl">Camera</div>
        </div>
      </div>
    </div>
  );
}

export default CameraPanel;
