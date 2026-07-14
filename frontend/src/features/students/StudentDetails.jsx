import React from "react";

export default function StudentDetails({ student, onBack }) {
  return (
    <div className="student-details-container">
      <button onClick={onBack} className="btn-cancel">
        Back to List
      </button>
      <h2>Detailed View: {student.name}</h2>
      <p>
        <strong>Email:</strong> {student.email}
      </p>
      <p>
        <strong>Department:</strong> {student.dept}
      </p>
      <p>
        <strong>Semester:</strong> {student.sem}
      </p>
      <p>
        <strong>Phone:</strong> {student.phone}
      </p>
    </div>
  );
}
