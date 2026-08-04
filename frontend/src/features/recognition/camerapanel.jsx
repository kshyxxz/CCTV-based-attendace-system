// recognition/CameraPanel.jsx
import { FaVideo, FaCamera, FaStop } from "react-icons/fa";

function CameraPanel({
  isCameraActive,
  handleStartCamera,
  handleCaptureSnapshot,
  stats,
  classesList = [],
  classLoading,
  selectedClassId,
  setSelectedClassId,
  cameraSource,
  cameraSourceLoading,
  cameraSourceError,
  streamUrl,
  videoRef,
  detections = [],
}) {
  return (
    <div className="video-panel">
      <div className="controls-panel">
        <div className="controls-left">
          {/* Stack select dropdown and source status vertically */}
          <div className="select-and-source-group">
            <div className="control-select-group">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                disabled={isCameraActive || classLoading}
              >
                {classLoading ? (
                  <option value="">Loading classes...</option>
                ) : classesList.length === 0 ? (
                  <option value="">No classes found</option>
                ) : (
                  classesList.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.class_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Camera source now directly under the select element */}
            <div className="source-status-wrapper">
              {cameraSourceLoading ? (
                <div className="camera-source-status">Loading...</div>
              ) : cameraSource ? (
                <div className="camera-source-status success">
                  Source: {cameraSource}
                </div>
              ) : (
                <div className="camera-source-status warning">
                  No camera source
                </div>
              )}
              {cameraSourceError && (
                <div className="camera-source-status error">
                  {cameraSourceError}
                </div>
              )}
            </div>
          </div>

          <button
            className={`btn-action-trigger ${isCameraActive ? "btn-stop" : "btn-start"}`}
            onClick={handleStartCamera}
            disabled={
              isCameraActive
                ? false
                : !selectedClassId ||
                  Boolean(cameraSourceLoading) ||
                  !cameraSource
            }
          >
            {isCameraActive ? <FaStop /> : <FaVideo />}
            <span>{isCameraActive ? "Stop Camera" : "Start Camera"}</span>
          </button>
        </div>
      </div>

      <div
        className={`video-screen ${isCameraActive ? "active" : "offline"}`}
        style={{ position: "relative" }}
      >
        {isCameraActive && streamUrl && (
          <img
            id="mjpeg-feed"
            src={streamUrl}
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
