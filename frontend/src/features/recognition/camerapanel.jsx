import { FaVideo, FaCamera, FaStop, FaRegDotCircle } from "react-icons/fa";

function CameraPanel({
  isCameraActive,
  selectedCamera,
  setSelectedCamera,
  selectedClass,
  setSelectedClass,
  handleStartCamera,
  stats,
}) {
  const handleCaptureSnapshot = async () => {
    try {
      // Example Endpoint: POST /api/camera/snapshot
      // const response = await fetch('/api/camera/snapshot', { method: 'POST', body: JSON.stringify({ camera: selectedCamera }) });
      // const blob = await response.blob();
      alert("Snapshot event triggered and saved via API.");
    } catch (error) {
      console.error("Error capturing snapshot:", error);
    }
  };

  return (
    <div className="video-panel">
      <div className="controls-panel">
        <div className="controls-left">
          <div className="control-select-group">
            <FaVideo className="control-icon" />
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
            >
              <option value="Main Hall Cam 1">Main Hall Cam 1</option>
              <option value="Main Hall Cam 2">Main Hall Cam 2</option>
              <option value="Lab Room 3">Lab Room 3</option>
            </select>
          </div>

          <div className="control-select-group">
            <FaRegDotCircle className="control-icon" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="AI & ML">AI & ML</option>
              <option value="Computer Architecture">
                Computer Architecture
              </option>
              <option value="Data Structures">Data Structures</option>
            </select>
          </div>

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
            {/* Direct your video feed source element here once streaming from API endpoints */}
            {/* <img src={`/api/streams/feed?id=${selectedCamera}`} alt="Live Stream Container" /> */}
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
