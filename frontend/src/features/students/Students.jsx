// Student.jsx
import React from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import StudentTable from "./StudentTable";
import StudentForm from "./StudentForm";
import { useStudents } from "../../../hooks/useStudents";
import "./Students.css";

function Students() {
  const {
    students,
    loading,
    error,
    isModalOpen,
    editingStudent,
    searchQuery,
    setSearchQuery,
    handleEditClick,
    handleCloseModal,
    refreshStudents,
    handleDeleteStudent,
  } = useStudents();

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="student-container">
      <div className="student-header">
        <div>
          <h1>Student Management</h1>
          <p className="subtitle">{students.length} students enrolled</p>
        </div>
        <button className="btn-add" onClick={() => handleEditClick(null)}>
          <FaPlus /> Add Student
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="status-message">Loading profiles...</div>}
      {error && <div className="status-message error-text">Error: {error}</div>}

      {!loading && !error && (
        <StudentTable
          filteredStudents={filteredStudents}
          onEdit={handleEditClick} // <-- Pass down edit click handler
          onDelete={handleDeleteStudent}
        />
      )}

      {isModalOpen && (
        <StudentForm
          studentData={editingStudent} // <-- Pass down item data (null means new student mode)
          onClose={handleCloseModal}
          refreshStudents={refreshStudents}
        />
      )}
    </div>
  );
}

export default Students;
