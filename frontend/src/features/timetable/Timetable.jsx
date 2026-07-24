import React from "react";
import { useTimetable } from "../../../hooks/useTimetable";
import "./timetable.css";

function Timetable() {
  const { selectedClass, setSelectedClass, schedule, loading } = useTimetable();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Timetable</h1>
          <p className="page-subtitle">Weekly schedule by class</p>
        </div>
      </div>

      <div className="timetable-toolbar">
        <select
          className="class-select-dropdown"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="Grade 10 - A">Grade 10 - A</option>
          <option value="Grade 10 - B">Grade 10 - B</option>
          <option value="Grade 11 - A">Grade 11 - A</option>
        </select>
        <span className="academic-year-text">
          Weekly Schedule • Academic Year 2025–26
        </span>
      </div>

      {loading ? (
        <div className="loading-state">Loading timetable...</div>
      ) : (
        <div className="timetable-grid-wrapper">
          <table className="timetable-grid">
            <thead>
              <tr>
                <th>TIME</th>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((slot, index) => (
                <tr key={index}>
                  <td className="time-slot-cell">{slot.time}</td>
                  {days.map((day) => {
                    const item = slot[day];
                    return (
                      <td key={day}>
                        {item ? (
                          <div className="slot-card">
                            <div
                              className="slot-subject"
                              style={{ color: item.color }}
                            >
                              {item.subject}
                            </div>
                            <div className="slot-teacher">{item.teacher}</div>
                          </div>
                        ) : (
                          <div className="slot-card empty">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Timetable;
