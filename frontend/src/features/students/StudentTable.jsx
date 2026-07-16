import React from "react";

export default function StudentTable({ filteredStudents }) {
  return (
    <div className="table-responsive">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No</th>
            <th>Dept / Sem</th>
            <th>Phone</th>
            <th>Embedding</th>
            <th>Attendance</th>
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
                {/* <td>
                  <div className="dept-text">{student.dept}</div>
                  <div className="sem-text text-muted">{student.sem}</div>
                </td> */}
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
