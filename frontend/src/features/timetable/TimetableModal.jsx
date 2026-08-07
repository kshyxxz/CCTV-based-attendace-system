import React from "react";

export function TimetableModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  selectedClass,
  daysOfWeek,
  isEditMode = false,
  title = "Add Period",
  submitLabel = "Save Period",
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>
          {title} ({selectedClass})
        </h2>
        {isEditMode && (
          <p style={{ marginBottom: "12px", color: "#64748b" }}>
            Only the subject can be updated for an existing timetable entry.
          </p>
        )}
        <form onSubmit={onSubmit}>
          <div className="form-field">
            <label>Subject Code</label>
            <input
              type="text"
              placeholder="e.g. ENSH105"
              value={formData.subject_code}
              onChange={(e) =>
                setFormData({ ...formData, subject_code: e.target.value })
              }
              required
            />
          </div>

          {!isEditMode && (
            <>
              <div className="form-field">
                <label>Day of Week</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) =>
                    setFormData({ ...formData, day_of_week: e.target.value })
                  }
                >
                  {daysOfWeek.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Start Time</label>
                  <input
                    type="time"
                    step="1"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label>End Time</label>
                  <input
                    type="time"
                    step="1"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-close" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
