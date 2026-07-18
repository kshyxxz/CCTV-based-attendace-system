import { FaSearch } from "react-icons/fa";

function AttendanceFilters({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
}) {
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="attendance-filters-bar" onSubmit={handleSearchSubmit}>
      {/* Date Picker Input */}
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
        >
          <option value="All">All Subjects</option>
          <option value="AI & ML">AI & ML</option>
          <option value="DBMS">DBMS</option>
          <option value="Networks">Networks</option>
          <option value="OS">OS</option>
          <option value="SE">SE</option>
        </select>
      </div>

      {/* Status Filter Dropdown */}
      <div className="filter-input-wrapper">
        <select
          name="status"
          className="filter-dropdown"
          value={filters.status}
          onChange={handleSelectChange}
        >
          <option value="All">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      <button type="submit" className="btn-search-trigger">
        Search
      </button>
    </form>
  );
}

export default AttendanceFilters;
