// CameraPanel.jsx
import { FaVideo, FaCamera, FaStop } from "react-icons/fa";

function CameraPanel({
  isCameraActive,
  handleStartCamera,
  handleCaptureSnapshot,
  stats,
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

      <div className={`video-screen ${isCameraActive ? "active" : "offline"}`}>
        {isCameraActive ? (
          <div className="video-placeholder-active">
            <div className="stream-live-indicator">
              <span className="live-dot"></span> LIVE
            </div>
            <p>Receiving Real-Time CCTV Feed Stream...</p>
          </div>
        ) : (
          <div className="video-placeholder-offline">
            <FaCamera className="offline-camera-icon" />
            <h3>Camera is offline</h3>
            <p>Click "Start Camera" to begin recognition</p>
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
