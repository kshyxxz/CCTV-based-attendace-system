import { FaNetworkWired, FaFileAlt } from "react-icons/fa";

function LiveFeedCard({ filteredLogs }) {
  return (
    <div className="live-feed-card">
      <div className="feed-header">
        <FaNetworkWired className="feed-icon" />
        <span>Live Recognition</span>
      </div>

      <div className="feed-logs-list">
        {filteredLogs.map((log, index) => (
          <div key={index} className={`feed-item ${log.status.toLowerCase()}`}>
            <div className="feed-item-left">
              <div className="feed-user-details">
                <span className="student-name-text">{log.name}</span>
                <span className="student-roll-text">{log.roll}</span>
                <span className="log-timestamp">{log.time}</span>
              </div>
            </div>
            <div className="feed-item-right">
              <span className={`status-pill ${log.status.toLowerCase()}`}>
                <span className="status-dot"></span>
                {log.status}
              </span>
              <span className="accuracy-percentage">{log.accuracy}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="view-records-btn">
        <FaFileAlt /> View All Records
      </button>
    </div>
  );
}

export default LiveFeedCard;
