import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaIdCard, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
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
    <div className="modal-backdrop student-modal-backdrop" onMouseDown={onClose}>
      <div className="modal-content student-detail-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="student-modal-header student-modal-header-centered">
          <h2>Student detail</h2>
        </div>

        {loading && <div className="status-message">Loading details...</div>}
        {error && (
          <div className="status-message error-text">Error: {error}</div>
        )}

        {!loading && !error && studentDetails && (
          <div className="student-detail-body">
            <div className="student-profile-summary">
              <div className="student-avatar">{studentDetails.name?.charAt(0) || "S"}</div>
              <div>
                <h3>{studentDetails.name}</h3>
                <p>{studentDetails.rollno}</p>
                <span className={`badge ${studentDetails.embedding ? "completed" : "pending"}`}>
                  <FaCheckCircle /> {studentDetails.embedding ? "Face profile ready" : "Face profile pending"}
                </span>
              </div>
            </div>

            <div className="student-contact-grid">
              <div><FaIdCard /><span>Class</span><strong>{studentDetails.class_name || "Unassigned"}</strong></div>
              <div><FaPhoneAlt /><span>Phone</span><strong>{studentDetails.phone || "N/A"}</strong></div>
              <div className="student-contact-wide"><FaMapMarkerAlt /><span>Address</span><strong>{studentDetails.address || "N/A"}</strong></div>
            </div>

            <div className="detail-group attendance-stats-section">
              <div className="student-section-heading"><h4>Attendance by subject</h4><span>{attendanceStats.length} subjects</span></div>
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

        <div className="modal-actions student-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
