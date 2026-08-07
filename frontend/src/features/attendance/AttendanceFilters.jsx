// AttendanceFilters.jsx
import { useState, useEffect } from "react";
import { subjectService } from "../../../services/subjectServices";
import { classService } from "../../../services/classesServices";

function AttendanceFilters({ filters, setFilters, rollGroups }) {
  const [subjectsList, setSubjectsList] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [classesList, setClassesList] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

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

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const data = await classService.getClasses();
        setClassesList(Array.isArray(data) ? data : data?.classes || []);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setClassesList([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    if (name === "classId") {
      const selectedClass = classesList.find(
        (classItem) => String(classItem.class_id ?? classItem.id) === value,
      );
      setFilters((prev) => ({
        ...prev,
        classId: value,
        className:
          selectedClass?.class_name ?? selectedClass?.name ?? "",
      }));
      return;
    }

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

      <div className="filter-input-wrapper">
        <select
          name="classId"
          className="filter-dropdown"
          value={filters.classId}
          onChange={handleSelectChange}
          disabled={loadingClasses}
          aria-label="Filter attendance by class"
        >
          <option value="All">
            {loadingClasses ? "Loading Classes..." : "All Classes"}
          </option>
          {classesList.map((classItem) => {
            const classId = classItem.class_id ?? classItem.id;
            const className = classItem.class_name ?? classItem.name ?? classId;

            return (
              <option key={classId} value={classId}>
                {className}
              </option>
            );
          })}
        </select>
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

      {filters.date ||
      filters.subject !== "All" ||
      filters.classId !== "All" ||
      filters.rollGroup !== "All" ? (
        <button
          type="button"
          className="btn-clear-filter"
          onClick={() =>
            setFilters({
              date: "",
              subject: "All",
              classId: "All",
              className: "",
              rollGroup: "All",
            })
          }
        >
          Reset Filters
        </button>
      ) : null}
    </div>
  );
}

export default AttendanceFilters;
