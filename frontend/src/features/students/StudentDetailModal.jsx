import React, { useState, useEffect } from "react";
import { studentService } from "../../../services/studentServices";

export default function StudentDetailModal({ rollno, onClose }) {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await studentService.getStudentByRollNo(rollno);
        const data = res?.data || res?.student || res;
        setStudentDetails(data);
      } catch (err) {
        setError(err.message || "Failed to fetch student details");
      } finally {
        setLoading(false);
      }
    };

    if (rollno) {
      fetchDetails();
    }
  }, [rollno]);

  const attendanceStats = studentDetails?.attendance_stats || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Student Details</h2>
        </div>

        {loading && <div className="status-message">Loading details...</div>}
        {error && (
          <div className="status-message error-text">Error: {error}</div>
        )}

        {!loading && !error && studentDetails && (
          <div className="student-detail-body">
            <div className="detail-group">
              <h3>{studentDetails.name}</h3>
              <p className="text-muted">
                <strong>Roll No:</strong> {studentDetails.rollno}
              </p>
              <p className="text-muted">
                <strong>Class Name:</strong> {studentDetails.class_name}
              </p>
              <p className="text-muted">
                <strong>Address:</strong> {studentDetails.address || "N/A"}
              </p>
              <p className="text-muted">
                <strong>Phone:</strong> {studentDetails.phone || "N/A"}
              </p>
              <p className="text-muted">
                <strong>Embedding:</strong>{" "}
                <span
                  className={`badge ${studentDetails.embedding ? "completed" : "pending"}`}
                >
                  <span className="dot"></span>{" "}
                  {studentDetails.embedding ? "Ready" : "Pending"}
                </span>
              </p>
            </div>

            <hr className="divider" />

            <div className="detail-group">
              <h4>Attendance Stats</h4>
              {attendanceStats.length > 0 ? (
                <ul className="attendance-list">
                  {attendanceStats.map((stat, idx) => (
                    <li key={idx} className="attendance-item">
                      <span>{stat.subject}</span>
                      <span className="badge-count">{stat.count} Present</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No attendance stats available.</p>
              )}
            </div>
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: "20px" }}>
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
