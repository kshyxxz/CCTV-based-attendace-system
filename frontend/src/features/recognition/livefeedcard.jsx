import React, { useState, useMemo } from "react";
import { FaListAlt, FaTrashAlt } from "react-icons/fa";
import "./livefeedcard.css"; // optional: keep your styles here

/**
 * Props:
 * - recognitionLogs: full array of logs from hook (newest first)
 * - filteredLogs: logs filtered by search query (newest first)
 * - clearRecognitionLogs: function to clear logs
 */
function LiveFeedCard({
  recognitionLogs = [],
  filteredLogs = [],
  clearRecognitionLogs,
}) {
  const [expanded, setExpanded] = useState(false);

  // How many recent items to show in compact view
  const MAX_RECENT = 10;

  // Use filteredLogs for display (search applied in parent)
  const logsToDisplay = useMemo(() => {
    // filteredLogs is already newest-first (we maintain that in hook)
    if (expanded) {
      return filteredLogs;
    }
    // compact view: show only the most recent MAX_RECENT items
    return filteredLogs.slice(0, MAX_RECENT);
  }, [filteredLogs, expanded]);

  const handleToggleViewAll = () => {
    setExpanded((prev) => !prev);
  };

  const handleClear = () => {
    const ok = window.confirm(
      "Clear all recognition records from the live feed?",
    );
    if (ok && typeof clearRecognitionLogs === "function") {
      clearRecognitionLogs();
      setExpanded(false);
    }
  };

  return (
    <div className="livefeed-card">
      <div className="livefeed-header">
        <h3>Live Recognition</h3>
        <div className="livefeed-actions">
          <button
            className="btn-action"
            onClick={handleToggleViewAll}
            aria-pressed={expanded}
            title={expanded ? "Show recent" : "View all records"}
          >
            <FaListAlt />
            <span>{expanded ? "Show Recent" : "View All Records"}</span>
          </button>

          <button
            className="btn-action btn-danger"
            onClick={handleClear}
            title="Clear records"
          >
            <FaTrashAlt />
            <span>Clear Records</span>
          </button>
        </div>
      </div>

      <div className="livefeed-body">
        {logsToDisplay.length === 0 ? (
          <div className="empty-state">
            <p>No recognition records yet.</p>
          </div>
        ) : (
          <ul className="livefeed-list">
            {logsToDisplay.map((log, idx) => (
              <li
                key={`${log.roll}-${log.time}-${idx}`}
                className="livefeed-item"
              >
                <div className="item-left">
                  <div className="item-name">{log.name}</div>
                  <div className="item-roll">Roll: {log.roll}</div>
                </div>
                <div className="item-right">
                  <div className="item-time">{log.time}</div>
                  <div
                    className={`item-status ${log.status === "Present" ? "present" : "unknown"}`}
                  >
                    {log.status}
                  </div>
                </div>
                <div className="item-accuracy">{log.accuracy}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!expanded && recognitionLogs.length > MAX_RECENT && (
        <div className="livefeed-footer">
          <small>
            Showing {Math.min(MAX_RECENT, filteredLogs.length)} of{" "}
            {filteredLogs.length} matching records
          </small>
        </div>
      )}
    </div>
  );
}

export default LiveFeedCard;
