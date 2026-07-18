// StudentTable.jsx
import React from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

export default function StudentTable({ filteredStudents, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No</th>
            <th>Phone</th>
            <th>Embedding</th>
            <th>Attendance</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted py-4">
                No records found.
              </td>
            </tr>
          ) : (
            filteredStudents.map((student) => (
              <tr key={student.id || student.rollNo}>
                <td>
                  <div className="student-profile-cell">
                    <img
                      src={student.avatar || "https://via.placeholder.com/40"}
                      alt={student.name}
                      className="table-avatar"
                    />
                    <div>
                      <div className="student-name">{student.name}</div>
                      <div className="student-email">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="text-muted">{student.rollNo}</td>
                <td className="text-muted">{student.phone}</td>
                <td>
                  <span
                    className={`badge ${(student.embedding || "Pending").toLowerCase()}`}
                  >
                    <span className="dot"></span>{" "}
                    {student.embedding || "Pending"}
                  </span>
                </td>
                <td>
                  <div className="attendance-cell">
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${student.attendance || 0}%` }}
                      ></div>
                    </div>
                    <span className="attendance-percentage">
                      {student.attendance || 0}%
                    </span>
                  </div>
                </td>
                <td className="text-center">
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(student)}
                      title="Edit Student"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(student.id || student.rollNo)}
                      title="Delete Student"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
