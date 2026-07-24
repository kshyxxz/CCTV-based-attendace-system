import React from "react";

export default function StudentDetails({ student, onBack }) {
  return (
    <div className="student-details-container">
      <button onClick={onBack} className="btn-cancel">
        Back to List
      </button>
      <h2>Detailed View: {student.name}</h2>
      <p>
        <strong>Address:</strong> {student.address}
      </p>
      <p>
        <strong>Phone:</strong> {student.phone}
      </p>
    </div>
  );
}
