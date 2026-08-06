// AttendanceFilters.jsx
import { useState, useEffect } from "react";
import { subjectService } from "../../../services/subjectServices";

function AttendanceFilters({ filters, setFilters, rollGroups }) {
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

      {/* Roll-number group dropdown: NCE080BCT018 -> 080BCT */}
      <div className="filter-input-wrapper">
        <select
          name="rollGroup"
          className="filter-dropdown"
          value={filters.rollGroup}
          onChange={handleSelectChange}
          aria-label="Filter attendance by roll-number group"
        >
          <option value="All">All Roll Groups</option>
          {rollGroups.map((rollGroup) => (
            <option key={rollGroup} value={rollGroup}>
              {rollGroup}
            </option>
          ))}
        </select>
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

      {filters.date || filters.subject !== "All" || filters.rollGroup !== "All" ? (
        <button
          type="button"
          className="btn-clear-filter"
          onClick={() =>
            setFilters({ date: "", subject: "All", rollGroup: "All" })
          }
        >
          Reset Filters
        </button>
      ) : null}
    </div>
  );
}

export default AttendanceFilters;
