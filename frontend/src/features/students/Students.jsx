import React from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import StudentTable from "./studentTable";
import StudentForm from "./StudentForm";
import { useStudents } from "../../../hooks/useStudents";
import "./students.css";

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

  const filteredStudents =
    students?.filter?.(
      (student) =>
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollno?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.address?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <div className="student-container">
      <div className="student-header">
        <div>
          <h1>Student Registry</h1>
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
            placeholder="Search by name, roll no, class, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="status-message">Loading students...</div>}
      {error && <div className="status-message error-text">Error: {error}</div>}

      {!loading && !error && (
        <StudentTable
          filteredStudents={filteredStudents}
          onEdit={handleEditClick}
          onDelete={handleDeleteStudent}
        />
      )}

      {isModalOpen && (
        <StudentForm
          studentData={editingStudent}
          onClose={handleCloseModal}
          refreshStudents={refreshStudents}
        />
      )}
    </div>
  );
}

export default Students;
