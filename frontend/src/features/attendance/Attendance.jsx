// Attendance.jsx
import { FaFileExcel, FaFileCsv, FaFilePdf } from "react-icons/fa";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";
import { useAttendance } from "../../../hooks/useAttendance";
import { attendanceService } from "../../../services/attendanceServices";
import "./attendance.css";

function Attendance() {
  const {
    records,
    loading,
    totalRecords,
    currentPage,
    setCurrentPage,
    totalPages,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
  } = useAttendance();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setCurrentPage(1);
  };

  const handleExport = (format) => {
    try {
      const exportUrl = attendanceService.getExportUrl(format, filters);
      window.open(exportUrl, "_blank");
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    }
  };

  return (
    <div className="attendance-page-container">
      <div className="attendance-header-row">
        <div>
          <h1 className="attendance-title">Attendance Records</h1>
          <p className="attendance-subtitle">
            View and export student attendance history
          </p>
        </div>
        <div className="export-button-group">
          <button
            className="btn-export btn-excel"
            onClick={() => handleExport("xlsx")}
          >
            <FaFileExcel /> <span>Excel</span>
          </button>
          <button
            className="btn-export btn-csv"
            onClick={() => handleExport("csv")}
          >
            <FaFileCsv /> <span>CSV</span>
          </button>
          <button
            className="btn-export btn-pdf"
            onClick={() => handleExport("pdf")}
          >
            <FaFilePdf /> <span>PDF</span>
          </button>
        </div>
      </div>

      <AttendanceFilters
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
      />

      {loading ? (
        <div className="attendance-loading">Loading attendance records...</div>
      ) : (
        <AttendanceTable
          records={records}
          totalRecords={totalRecords}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default Attendance;
