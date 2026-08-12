import { useState, useEffect } from "react";
import { subjectService } from "../services/subjectServices";

export function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectService.getSubjects();
      setSubjects(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subject = null) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingSubject(null);
    setIsModalOpen(false);
  };

  const handleDeleteSubject = async (subject) => {
    try {
      await subjectService.deleteSubject(subject);
      await fetchSubjects();
    } catch (err) {
      alert(`Failed to delete subject: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects,
    loading,
    error,
    isModalOpen,
    editingSubject,
    handleOpenModal,
    handleCloseModal,
    handleDeleteSubject,
    refreshSubjects: fetchSubjects,
  };
}
