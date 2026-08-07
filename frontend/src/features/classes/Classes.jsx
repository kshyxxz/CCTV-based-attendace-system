import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaPlus,
  FaPencilAlt,
  FaTrash,
  FaVideo,
} from "react-icons/fa";
import { useClasses } from "../../../hooks/useClasses";
import { classService } from "../../../services/classesServices";
import "./classes.css";

function Classes() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateRoute = location.pathname === "/classes/create";

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

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [classNameInput, setClassNameInput] = useState("");
  const [cameraSourceInput, setCameraSourceInput] = useState("0");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleAddClass = () => {
    navigate("/classes/create");
  };

  const handleCloseCreateForm = () => {
    navigate("/classes");
  };

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleDeleteRequest = (className) => {
    setDeleteTarget(className);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteClass(deleteTarget);
    setDeleteTarget(null);
  };

  useEffect(() => {
    if (editingClass) {
      setClassNameInput(editingClass.class_name || "");
      setCameraSourceInput(editingClass.camera_source || "0");
    } else {
      setClassNameInput("");
      setCameraSourceInput("0");
    }
  }, [editingClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;

    try {
      if (editingClass) {
        await classService.updateClass(
          editingClass.class_name,
          classNameInput,
          cameraSourceInput,
        );
      } else {
        await classService.createClass(classNameInput, cameraSourceInput);
      }
      setHasUnsavedChanges(false);
      await refreshClasses();
      handleCloseModal();
      if (isCreateRoute) {
        navigate("/classes");
      }
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
        <button className="btn-primary" onClick={handleAddClass}>
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
                      <p className="class-details">
                        <FaVideo style={{ marginRight: "4px" }} />
                        Source: {cls.camera_source}
                      </p>
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
                      onClick={() => handleDeleteRequest(cls.class_name)}
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

      {(isCreateRoute || isModalOpen) && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingClass ? "Edit Class" : "Create New Class"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A-100"
                  value={classNameInput}
                  onChange={(e) => {
                    setClassNameInput(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="form-group">
                <label>Camera Source</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0 or rtsp://192.168.1.50:554/stream"
                  value={cameraSourceInput}
                  onChange={(e) => {
                    setCameraSourceInput(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      const proceed = window.confirm(
                        "You have unsaved changes. Do you want to leave this form?",
                      );
                      if (!proceed) return;
                    }
                    setHasUnsavedChanges(false);
                    handleCloseModal();
                    if (isCreateRoute) {
                      handleCloseCreateForm();
                    }
                  }}
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

      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Delete Class</h2>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete class{" "}
                <strong>{deleteTarget}</strong>?
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

export default Classes;
