import React from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

export default function StudentTable({ filteredStudents, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="student-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Embedding</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                No student records found.
              </td>
            </tr>
          ) : (
            filteredStudents.map((student) => (
              <tr key={student.rollno}>
                <td className="student-name">{student.rollno}</td>
                <td>{student.name}</td>
                <td>
                  <span
                    className="badge"
                    style={{ backgroundColor: "#e2e8f0", color: "#334155" }}
                  >
                    {student.class_name || "Unassigned"}
                  </span>
                </td>
                <td className="text-muted">{student.address || "N/A"}</td>
                <td className="text-muted">{student.phone}</td>
                <td>
                  <span
                    className={`badge ${student.embedding ? "completed" : "pending"}`}
                  >
                    <span className="dot"></span>{" "}
                    {student.embedding ? "Ready" : "Pending"}
                  </span>
                </td>
                <td className="text-center">
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
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
                      onClick={() => onDelete(student.rollno)}
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
