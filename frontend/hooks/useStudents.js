import { useState, useEffect } from "react";
import { studentService } from "../services/studentServices";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
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

  const handleEditClick = (student = null) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const handleDeleteStudent = async (rollno) => {
    if (!window.confirm(`Are you sure you want to delete student ${rollno}?`)) {
      return;
    }
    try {
      setError(null);
      await studentService.deleteStudent(rollno);
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
    editingStudent,
    searchQuery,
    setSearchQuery,
    handleEditClick,
    handleCloseModal,
    refreshStudents: fetchStudents,
    handleDeleteStudent,
  };
}
