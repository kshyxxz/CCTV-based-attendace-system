import React from "react";

export function TimetableHeader({
  selectedClass,
  setSelectedClass,
  classesList,
  onOpenAddModal,
}) {
  return (
    <>
      <div className="timetable-header">
        <div>
          <h1 className="title">Timetable</h1>
          <p className="subtitle">Weekly schedule by class</p>
        </div>
      </div>

      <div className="timetable-toolbar">
        <div className="toolbar-left">
          <label htmlFor="class-select" className="select-label">
            Select Class:
          </label>
          <select
            id="class-select"
            className="class-dropdown"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classesList.length === 0 ? (
              <option value="">No classes available</option>
            ) : (
              classesList.map((cls, idx) => {
                const name =
                  typeof cls === "string" ? cls : cls.class_name || cls.name;
                return (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                );
              })
            )}
          </select>
        </div>

        <div className="toolbar-right">
          <button
            className="btn-add-period"
            onClick={onOpenAddModal}
            disabled={!selectedClass}
          >
            + Add Period
          </button>
        </div>
      </div>
    </>
  );
}
