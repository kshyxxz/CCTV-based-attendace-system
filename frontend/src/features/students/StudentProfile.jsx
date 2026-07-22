import React from "react";

export default function StudentProfile({ student }) {
  return (
    <div className="student-profile-card">
      <img
        src={student.avatar || "https://via.placeholder.com/150"}
        alt={student.name}
      />
      <h3>{student.name}</h3>
      <p>{student.rollNo}</p>
    </div>
  );
}
