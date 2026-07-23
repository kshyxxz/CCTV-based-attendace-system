import React, { useState, useEffect } from "react";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import { useSubjects } from "../../../hooks/useSubject";
import { subjectService } from "../../../services/subjectServices";
import "./subjects.css";

function Subjects() {
  const {
    subjects,
    loading,
    error,
    isModalOpen,
    editingSubject,
    handleOpenModal,
    handleCloseModal,
    handleDeleteSubject,
    refreshSubjects,
  } = useSubjects();

  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
  });

  useEffect(() => {
    if (editingSubject) {
      setFormData({
        subject_code: editingSubject.subject_code || "",
        subject_name: editingSubject.subject_name || "",
      });
    } else {
      setFormData({
        subject_code: "",
        subject_name: "",
      });
    }
  }, [editingSubject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await subjectService.updateSubject({
          subject_id: editingSubject.subject_id,
          new_subject_code: formData.subject_code,
          new_subject_name: formData.subject_name,
        });
      } else {
        await subjectService.createSubject({
          subject_code: formData.subject_code,
          subject_name: formData.subject_name,
        });
      }
      await refreshSubjects();
      handleCloseModal();
    } catch (err) {
      alert(`Error saving subject: ${err.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-subtitle">Subject registry and details</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal(null)}>
          <FaPlus /> New Subject
        </button>
      </div>

      <div className="section-meta">{subjects.length} subjects registered</div>

      {loading && <div className="loading-state">Loading subjects...</div>}
      {error && <div className="loading-state error-text">Error: {error}</div>}

      {!loading && !error && (
        <div className="subjects-table-wrapper">
          <table className="subjects-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>CODE</th>
                <th>SUBJECT NAME</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No subjects found.
                  </td>
                </tr>
              ) : (
                subjects.map((sub) => (
                  <tr key={sub.subject_id}>
                    <td>
                      <span className="text-muted">#{sub.subject_id}</span>
                    </td>
                    <td>
                      <span className="code-badge">{sub.subject_code}</span>
                    </td>
                    <td>
                      <span className="subject-title">{sub.subject_name}</span>
                    </td>
                    <td className="text-right">
                      <div className="table-actions">
                        <button
                          className="btn-action"
                          title="Edit"
                          onClick={() => handleOpenModal(sub)}
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          className="btn-action"
                          onClick={() => handleDeleteSubject(sub.subject_id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingSubject ? "Edit Subject" : "Create New Subject"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  name="subject_code"
                  required
                  placeholder="e.g. ENCT351"
                  value={formData.subject_code}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  name="subject_name"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={formData.subject_name}
                  onChange={handleInputChange}
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
                  {editingSubject ? "Update Subject" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;
