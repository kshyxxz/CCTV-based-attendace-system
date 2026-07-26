import React, { useState } from "react";
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
  const {
    classesList = [],
    selectedClass,
    setSelectedClass,
    schedule = {},
    loading,
    error,
    addPeriod,
    deletePeriod,
  } = useTimetable();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject_code: "",
    day_of_week: "Monday",
    start_time: "08:00:00",
    end_time: "08:45:00",
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Check if schedule contains any periods
  const isScheduleEmpty = Array.isArray(schedule)
    ? schedule.length === 0
    : Object.keys(schedule || {}).length === 0 ||
      Object.values(schedule || {}).every((arr) => !arr || arr.length === 0);

  const handleDelete = async (timetableId) => {
    if (window.confirm("Remove this period?")) {
      try {
        await deletePeriod(timetableId);
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPeriod({
        class_name: selectedClass,
        subject_code: formData.subject_code,
        day_of_week: formData.day_of_week,
        start_time: ensureSecondsFormat(formData.start_time),
        end_time: ensureSecondsFormat(formData.end_time),
      });
      setIsModalOpen(false);
    } catch (err) {
      alert(`Failed to add period: ${err.message}`);
    }
  };

  return (
    <div className="timetable-page">
      <TimetableHeader
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classesList={classesList}
        onOpenAddModal={() => setIsModalOpen(true)}
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
          />
        )}
      </div>

      <TimetableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        selectedClass={selectedClass}
        daysOfWeek={daysOfWeek}
      />
    </div>
  );
}

export default Timetable;
