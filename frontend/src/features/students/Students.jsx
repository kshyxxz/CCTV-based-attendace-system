import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import StudentTable from "./StudentTable";
import StudentForm from "./StudentForm";
import StudentDetailModal from "./StudentDetailModal";
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

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedDetailRollno, setSelectedDetailRollno] = useState(null);

  const handleDeleteRequest = (rollno) => {
    setDeleteTarget(rollno);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteStudent(deleteTarget);
    setDeleteTarget(null);
  };

  const handleRowClick = (rollno) => {
    setSelectedDetailRollno(rollno);
  };

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
            placeholder="Search by name, roll no or address"
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
          onDelete={handleDeleteRequest}
          onRowClick={handleRowClick}
        />
      )}

      {isModalOpen && (
        <StudentForm
          studentData={editingStudent}
          onClose={handleCloseModal}
          refreshStudents={refreshStudents}
        />
      )}

      {selectedDetailRollno && (
        <StudentDetailModal
          rollno={selectedDetailRollno}
          onClose={() => setSelectedDetailRollno(null)}
        />
      )}

      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
            </div>
            <div className="modal-body">
              <p>
                Delete student <strong>{deleteTarget}</strong> ?
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
