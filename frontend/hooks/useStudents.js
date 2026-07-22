// hooks/useStudents.js
import { useState, useEffect } from "react";
import { studentService } from "../services/studentServices";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // Tracks the student being modified
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getStudents();
      setStudents(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true); // Reuses your modal form block for editing
  };

  const handleCloseModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const handleDeleteStudent = async (studentId) => {
    if (
      !window.confirm("Are you sure you want to delete this student profile?")
    ) {
      return;
    }
    try {
      setError(null);
      await studentService.deleteStudent(studentId);
      await fetchStudents();
    } catch (err) {
      setError(`Failed to delete student: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    isModalOpen,
    editingStudent, // Expose to pass into StudentForm
    searchQuery,
    setSearchQuery,
    handleEditClick, // Expose to Table layout row buttons
    handleCloseModal,
    refreshStudents: fetchStudents,
    handleDeleteStudent,
  };
}
