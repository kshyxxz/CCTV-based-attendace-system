import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import CameraPanel from "./CameraPanel";
import LiveFeedCard from "./LiveFeedCard";
import "./liverecognition.css";

function LiveRecognition() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("Main Hall Cam 1");
  const [selectedClass, setSelectedClass] = useState("AI & ML");
  const [recognitionLogs, setRecognitionLogs] = useState([]);
  const [stats, setStats] = useState({
    detected: 0,
    recognized: 0,
    unknown: 0,
    fps: 0,
  });

  // -------------------------------------------------------------
  // RESTful API Integration: Fetch Initial Logs & Stream Stats
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchCurrentSessionData = async () => {
      try {
        // Example Endpoint: GET /api/attendance/live-session?camera=Main Hall Cam 1
        // const response = await fetch(`/api/attendance/live-session?camera=${selectedCamera}&class=${selectedClass}`);
        // const data = await response.json();
        // setRecognitionLogs(data.logs);
        // setStats(data.stats);

        // Mock data fallback initialization
        setRecognitionLogs([
          {
            name: "Arjun Sharma",
            roll: "CE-2021-001",
            time: "09:02 AM",
            accuracy: "98.2%",
            status: "Present",
          },
          {
            name: "Priya Patel",
            roll: "CE-2021-002",
            time: "09:03 AM",
            accuracy: "96.7%",
            status: "Present",
          },
          {
            name: "Unknown",
            roll: "N/A",
            time: "09:04 AM",
            accuracy: "N/A",
            status: "Unknown",
          },
        ]);
        setStats({ detected: 3, recognized: 2, unknown: 1, fps: 0 });
      } catch (error) {
        console.error("Error fetching live session data:", error);
      }
    };

    fetchCurrentSessionData();
  }, [selectedCamera, selectedClass]);

  // -------------------------------------------------------------
  // Real-time Event Listener (WebSockets or Long Polling)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isCameraActive) {
      setStats((prev) => ({ ...prev, fps: 0 }));
      return;
    }

    // Connect to your WebSocket server or set up an interval poll here
    // const ws = new WebSocket(`ws://localhost:5000/api/live-stream`);
    // ws.onmessage = (event) => {
    //   const incoming = JSON.parse(event.data);
    //   if(incoming.type === 'NEW_DETECTION') {
    //      setRecognitionLogs(prev => [incoming.data, ...prev]);
    //      setStats(incoming.globalStats);
    //   }
    // };
    // return () => ws.close();

    // Simulated real-time streaming status update
    setStats((prev) => ({ ...prev, fps: 30, detected: 6, recognized: 5 }));
  }, [isCameraActive]);

  const handleStartCamera = async () => {
    try {
      const nextState = !isCameraActive;

      // Example Endpoint: POST /api/camera/toggle
      // await fetch('/api/camera/toggle', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ camera: selectedCamera, active: nextState })
      // });

      setIsCameraActive(nextState);
    } catch (error) {
      console.error("Failed to toggle system camera state:", error);
    }
  };

  const filteredLogs = recognitionLogs.filter(
    (log) =>
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.roll.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="live-recognition-container">
      <div className="live-header-row">
        <div>
          <h5 className="sub-title-text">Live Attendance</h5>
          <h1 className="main-title">Live Attendance Monitoring</h1>
          <p className="system-description-text">
            Real-time CCTV face recognition attendance system
          </p>
        </div>
        <div className="header-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search students, records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="live-content-grid">
        <CameraPanel
          isCameraActive={isCameraActive}
          selectedClass={selectedClass}
          handleStartCamera={handleStartCamera}
          stats={stats}
        />

        <LiveFeedCard filteredLogs={filteredLogs} />
      </div>
    </div>
  );
}

export default LiveRecognition;
