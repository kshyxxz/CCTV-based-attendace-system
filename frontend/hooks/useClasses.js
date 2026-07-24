import { useState, useEffect } from "react";
import { classService } from "../services/classesServices";

export function useClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getClasses();
      setClasses(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cls = null) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingClass(null);
    setIsModalOpen(false);
  };

  const handleDeleteClass = async (className) => {
    if (window.confirm(`Are you sure you want to delete class ${className}?`)) {
      try {
        await classService.deleteClass(className);
        await fetchClasses();
      } catch (err) {
        alert(`Failed to delete class: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    loading,
    error,
    isModalOpen,
    editingClass,
    handleOpenModal,
    handleCloseModal,
    handleDeleteClass,
    refreshClasses: fetchClasses,
  };
}
