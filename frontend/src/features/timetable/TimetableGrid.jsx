import React from "react";
import { FaTrash, FaCalendarTimes } from "react-icons/fa";

// Converts any time string ("11:00", "11:00:00", "11:00 AM") to total minutes
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  let str = timeStr.toString().trim().toUpperCase();
  let isPM = str.includes("PM");
  let isAM = str.includes("AM");

  str = str.replace(/(AM|PM)/g, "").trim();
  const parts = str.split(":");
  if (parts.length < 2) return 0;

  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

export function TimetableGrid({
  daysOfWeek,
  timeSlots,
  schedule = {},
  isScheduleEmpty,
  onDelete,
}) {
  if (isScheduleEmpty || !timeSlots || timeSlots.length === 0) {
    return (
      <div className="empty-schedule-view">
        <FaCalendarTimes className="empty-icon" />
        <h3>No schedule created yet</h3>
        <p>Click "Add Period" to start adding classes to the timetable.</p>
      </div>
    );
  }

  // Safe helper to extract periods for a day
  const getDayPeriods = (dayName) => {
    if (!schedule) return [];
    if (Array.isArray(schedule)) {
      return schedule.filter(
        (p) => p.day_of_week?.toLowerCase() === dayName.toLowerCase(),
      );
    }
    const matchedKey = Object.keys(schedule).find(
      (k) => k.toLowerCase() === dayName.toLowerCase(),
    );
    return matchedKey ? schedule[matchedKey] : [];
  };

  return (
    <div className="table-responsive">
      <table className="routine-table">
        <thead>
          <tr>
            <th className="day-header-th">DAY \ TIME</th>
            {timeSlots.map((slot) => (
              <th key={slot.rawKey} className="time-header-th">
                {slot.rawKey}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => {
            const dayPeriods = getDayPeriods(day);
            let slotIndex = 0;
            const tableCells = [];

            while (slotIndex < timeSlots.length) {
              const currentSlot = timeSlots[slotIndex];
              const slotStartMins = parseTimeToMinutes(currentSlot.startRaw);
              const slotEndMins = parseTimeToMinutes(currentSlot.endRaw);

              // Find a period that starts in this specific slot window
              const matchingPeriod = dayPeriods.find((p) => {
                const pStartMins = parseTimeToMinutes(p.start_time);
                // Strict match: Must start exactly at or within this slot boundary
                return pStartMins >= slotStartMins && pStartMins < slotEndMins;
              });

              if (matchingPeriod) {
                const pEndMins = parseTimeToMinutes(matchingPeriod.end_time);

                // Calculate how many standard slots this class covers
                let span = 0;
                for (let k = slotIndex; k < timeSlots.length; k++) {
                  const checkStart = parseTimeToMinutes(timeSlots[k].startRaw);
                  if (checkStart < pEndMins) {
                    span++;
                  } else {
                    break;
                  }
                }

                span = Math.max(1, span);

                tableCells.push(
                  <td
                    key={`${day}-${currentSlot.rawKey}-${slotIndex}`}
                    colSpan={span}
                    className="routine-td filled-td"
                  >
                    <div className="subject-card">
                      <span className="subject-title">
                        {matchingPeriod.subject_name ||
                          matchingPeriod.subject_code ||
                          matchingPeriod.subject}
                      </span>
                      <button
                        className="btn-delete-small"
                        title="Delete period"
                        onClick={() => onDelete(matchingPeriod.timetable_id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>,
                );

                slotIndex += span;
              } else {
                // Render empty cell slot
                tableCells.push(
                  <td
                    key={`${day}-${currentSlot.rawKey}-${slotIndex}`}
                    className="routine-td empty-td"
                  ></td>,
                );
                slotIndex++;
              }
            }

            return (
              <tr key={day}>
                <td className="day-name-td">{day}</td>
                {tableCells}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
