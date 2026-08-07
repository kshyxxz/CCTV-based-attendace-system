import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTimetable } from "../../../hooks/useTimetable";
import { TimetableHeader } from "./TimetableHeader";
import { TimetableGrid } from "./TimetableGrid";
import { TimetableModal } from "./TimetableModal";
import "./timetable.css";

// Helper: Ensures "HH:MM:SS" format for backend database insertion
const ensureSecondsFormat = (timeStr) => {
  if (!timeStr) return "00:00:00";
  const parts = timeStr.trim().split(":");
  if (parts.length === 2) return `${timeStr.trim()}:00`;
  return timeStr.trim();
};

// Standard fixed period slots matching institutional routine structures
const DEFAULT_TIME_SLOTS = [
  { startRaw: "07:15:00", endRaw: "08:00:00", rawKey: "07:15-08:00" },
  { startRaw: "08:00:00", endRaw: "08:45:00", rawKey: "08:00-08:45" },
  { startRaw: "08:45:00", endRaw: "09:30:00", rawKey: "08:45-09:30" },
  { startRaw: "09:30:00", endRaw: "10:15:00", rawKey: "09:30-10:15" },
  { startRaw: "10:15:00", endRaw: "11:00:00", rawKey: "10:15-11:00" },
  { startRaw: "11:00:00", endRaw: "11:45:00", rawKey: "11:00-11:45" },
  { startRaw: "11:45:00", endRaw: "12:30:00", rawKey: "11:45-12:30" },
  { startRaw: "12:30:00", endRaw: "13:15:00", rawKey: "12:30-01:15" },
  { startRaw: "13:15:00", endRaw: "14:00:00", rawKey: "01:15-02:00" },
  { startRaw: "14:00:00", endRaw: "14:45:00", rawKey: "02:00-02:45" },
  { startRaw: "14:45:00", endRaw: "15:30:00", rawKey: "02:45-03:30" },
];

function Timetable() {
  const navigate = useNavigate();
  const params = useParams();

  const {
    classesList = [],
    selectedClass,
    setSelectedClass,
    schedule = {},
    loading,
    error,
    addPeriod,
    updatePeriod,
    deletePeriod,
  } = useTimetable();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    subject_code: "",
    day_of_week: "Monday",
    start_time: "08:00:00",
    end_time: "08:45:00",
  });

  useEffect(() => {
    if (params.className) {
      const decodedClassName = decodeURIComponent(params.className);
      if (decodedClassName !== selectedClass) {
        setSelectedClass(decodedClassName);
      }
    }
  }, [params.className, selectedClass, setSelectedClass]);

  const handleOpenAddModal = () => {
    setEditingPeriod(null);
    setHasUnsavedChanges(false);
    setFormData({
      subject_code: "",
      day_of_week: "Monday",
      start_time: "08:00:00",
      end_time: "08:45:00",
    });
    setIsModalOpen(true);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPeriod(null);
    setHasUnsavedChanges(false);
    setFormData({
      subject_code: "",
      day_of_week: "Monday",
      start_time: "08:00:00",
      end_time: "08:45:00",
    });
    if (selectedClass) {
      navigate(`/timetable/${encodeURIComponent(selectedClass)}`);
    } else {
      navigate("/timetable");
    }
  };

  const handleEdit = (period) => {
    setEditingPeriod(period);
    setHasUnsavedChanges(false);
    setFormData({
      subject_code: period.subject_code || "",
      day_of_week: period.day_of_week || "Monday",
      start_time: period.start_time || "08:00:00",
      end_time: period.end_time || "08:45:00",
    });
    setIsModalOpen(true);
    if (selectedClass) {
      navigate(`/timetable/${encodeURIComponent(selectedClass)}`);
    } else {
      navigate("/timetable");
    }
  };

  const handleDelete = (period) => {
    setDeleteTarget(period);
  };

  const updateFormData = (changes) => {
    setFormData((prev) => ({ ...prev, ...changes }));
    setHasUnsavedChanges(true);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePeriod(deleteTarget.timetable_id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeleteTarget(null);
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Check if schedule contains any periods
  const isScheduleEmpty = Array.isArray(schedule)
    ? schedule.length === 0
    : Object.keys(schedule || {}).length === 0 ||
      Object.values(schedule || {}).every((arr) => !arr || arr.length === 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPeriod) {
        await updatePeriod({
          timetable_id: editingPeriod.timetable_id,
          subject_code: formData.subject_code,
        });
      } else {
        await addPeriod({
          class_name: selectedClass,
          subject_code: formData.subject_code,
          day_of_week: formData.day_of_week,
          start_time: ensureSecondsFormat(formData.start_time),
          end_time: ensureSecondsFormat(formData.end_time),
        });
      }
      setHasUnsavedChanges(false);
      handleCloseModal();
    } catch (err) {
      alert(
        editingPeriod
          ? `Failed to update period: ${err.message}`
          : `Failed to add period: ${err.message}`,
      );
    }
  };

  return (
    <div className="timetable-page">
      <TimetableHeader
        selectedClass={selectedClass}
        setSelectedClass={(value) => {
          setSelectedClass(value);
          if (value) {
            navigate(`/timetable/${encodeURIComponent(value)}`);
          } else {
            navigate("/timetable");
          }
        }}
        classesList={classesList}
        onOpenAddModal={handleOpenAddModal}
      />

      <div className="timetable-card-container">
        {loading ? (
          <div className="state-message">Loading schedule...</div>
        ) : error ? (
          <div className="state-message error">{error}</div>
        ) : (
          <TimetableGrid
            daysOfWeek={daysOfWeek}
            timeSlots={DEFAULT_TIME_SLOTS}
            schedule={schedule}
            isScheduleEmpty={isScheduleEmpty}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>

      <TimetableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={updateFormData}
        selectedClass={selectedClass}
        daysOfWeek={daysOfWeek}
        isEditMode={!!editingPeriod}
        title={editingPeriod ? "Edit Period" : "Add Period"}
        submitLabel={editingPeriod ? "Update Period" : "Save Period"}
      />

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Delete Period</h2>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete the period for{" "}
                <strong>
                  {deleteTarget.subject_name ||
                    deleteTarget.subject_code ||
                    "this period"}
                </strong>{" "}
                on {deleteTarget.day_of_week}?
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-close" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timetable;
