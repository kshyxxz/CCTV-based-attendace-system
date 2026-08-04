import React, { useState, useEffect } from "react";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import { useSubjects } from "../../../hooks/useSubject";
import { subjectService } from "../../../services/subjectServices";
import "./subjects.css";

const SUBJECT_CODE_REGEX = /^[A-Z]{2,4}\s?\d{3}$/;

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

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
  });

  // Sync form data when editing dynamic state changes
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
    setValidationError(""); // Reset error message on modal open/switch
  }, [editingSubject, isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Automatically convert subject_code inputs to uppercase
    const updatedValue = name === "subject_code" ? value.toUpperCase() : value;

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));

    // Clear error message when user starts fixing the subject code
    if (name === "subject_code" && validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedCode = formData.subject_code.trim();
    const trimmedName = formData.subject_name.trim();

    // Validate regex pattern: 2-4 uppercase letters, optional space, 3 digits
    if (!SUBJECT_CODE_REGEX.test(trimmedCode)) {
      setValidationError(
        "Invalid Code format. Must be 2–4 uppercase letters, optional space, and 3 digits (e.g., CS101 or MATH 202).",
      );
      return;
    }

    setIsSubmitting(true);
    setValidationError("");

    try {
      if (editingSubject) {
        await subjectService.updateSubject({
          subject_id: editingSubject.subject_id,
          new_subject_code: trimmedCode,
          new_subject_name: trimmedName,
        });
      } else {
        await subjectService.createSubject({
          subject_code: trimmedCode,
          subject_name: trimmedName,
        });
      }
      await refreshSubjects();
      handleCloseModal();
    } catch (err) {
      setValidationError(
        `Error saving subject: ${err.message || "An error occurred"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = (subject) => {
    setDeleteTarget(subject);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await handleDeleteSubject(deleteTarget.subject_id);
      setDeleteTarget(null);
    } catch (err) {
      alert(`Error deleting subject: ${err.message || "An error occurred"}`);
    } finally {
      setIsSubmitting(false);
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

      <div className="section-meta">
        {subjects?.length || 0} subjects registered
      </div>

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
              {subjects?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No subjects found.
                  </td>
                </tr>
              ) : (
                subjects?.map((sub) => (
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
                          onClick={() => handleDeleteRequest(sub)}
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

      {/* Create / Edit Modal */}
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
                  pattern="^[A-Z]{2,4}\s?\d{3}$"
                  title="2 to 4 uppercase letters, optional space, and 3 digits (e.g. ENCT351 or CS 101)"
                  placeholder="e.g. ENCT351 or MATH 202"
                  value={formData.subject_code}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={validationError ? "input-error" : ""}
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
                  disabled={isSubmitting}
                />
              </div>

              {validationError && (
                <div
                  className="form-error-message"
                  style={{
                    color: "#d9534f",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {validationError}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingSubject
                      ? "Update Subject"
                      : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Delete Subject</h2>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete subject{" "}
                <strong>{deleteTarget.subject_name}</strong>?
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={handleCancelDelete}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn-submit btn-danger"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;
