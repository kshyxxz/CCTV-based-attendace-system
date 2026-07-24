import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import { useClasses } from "../../../hooks/useClasses";
import { classService } from "../../../services/classesServices";
import "./classes.css";

function Classes() {
  const {
    classes,
    loading,
    error,
    isModalOpen,
    editingClass,
    handleOpenModal,
    handleCloseModal,
    handleDeleteClass,
    refreshClasses,
  } = useClasses();

  const [classNameInput, setClassNameInput] = useState("");

  useEffect(() => {
    if (editingClass) {
      setClassNameInput(editingClass.class_name);
    } else {
      setClassNameInput("");
    }
  }, [editingClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;

    try {
      if (editingClass) {
        await classService.updateClass(editingClass.class_name, classNameInput);
      } else {
        await classService.createClass(classNameInput);
      }
      await refreshClasses();
      handleCloseModal();
    } catch (err) {
      alert(`Error saving class: ${err.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-subtitle">Class configuration and registry</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal(null)}>
          <FaPlus /> New Class
        </button>
      </div>

      <div className="section-meta">{classes.length} classes configured</div>

      {loading && <div className="loading-state">Loading classes...</div>}
      {error && <div className="loading-state error-text">Error: {error}</div>}

      {!loading && !error && (
        <div className="classes-list">
          {classes.length === 0 ? (
            <div className="loading-state">
              No classes found. Add one above!
            </div>
          ) : (
            classes.map((cls, index) => (
              <div className="class-card" key={cls.class_name || index}>
                <div className="class-card-header">
                  <div className="class-title-group">
                    <div className="class-icon-wrapper">
                      <FaGraduationCap />
                    </div>
                    <div>
                      <h2 className="class-name">{cls.class_name}</h2>
                      <p className="class-details">Active Classroom Section</p>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-action"
                      title="Edit"
                      onClick={() => handleOpenModal(cls)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => handleDeleteClass(cls.class_name)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingClass ? "Edit Class Name" : "Create New Class"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A-100"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingClass ? "Update Class" : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;
