// AttendanceFilters.jsx
import { useState, useEffect } from "react";
import { subjectService } from "../../../services/subjectServices"; // Adjust path as needed

function AttendanceFilters({ filters, setFilters }) {
  const [subjectsList, setSubjectsList] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const data = await subjectService.getSubjects();
        // Extract subject names depending on array format (string[] or object[])
        const names = (data || []).map((s) => s.subject_name || s.name || s);
        setSubjectsList(names);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="attendance-filters-bar">
      {/* Date Filter */}
      <div className="filter-input-wrapper">
        <input
          type="date"
          name="date"
          className="filter-date-input"
          value={filters.date}
          onChange={handleSelectChange}
        />
      </div>

      {/* Subject Filter Dropdown */}
      <div className="filter-input-wrapper">
        <select
          name="subject"
          className="filter-dropdown"
          value={filters.subject}
          onChange={handleSelectChange}
          disabled={loadingSubjects}
        >
          <option value="All">
            {loadingSubjects ? "Loading Subjects..." : "All Subjects"}
          </option>
          {subjectsList.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {filters.date || filters.subject !== "All" ? (
        <button
          type="button"
          className="btn-clear-filter"
          onClick={() => setFilters({ date: "", subject: "All" })}
        >
          Reset Filters
        </button>
      ) : null}
    </div>
  );
}

export default AttendanceFilters;
