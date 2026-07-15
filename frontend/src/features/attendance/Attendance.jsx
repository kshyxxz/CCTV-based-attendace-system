import { useState, useEffect } from "react";
import { FaFileExcel, FaFileCsv, FaFilePdf, FaSearch } from "react-icons/fa";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";
import "./attendance.css";

function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);

  // Filter States
  const [filters, setFilters] = useState({
    date: "",
    subject: "All",
    status: "All",
    search: "",
  });

  // Temp search input state to allow submission via the search button
  const [searchQuery, setSearchQuery] = useState("");

  // -------------------------------------------------------------
  // RESTful API Integration: Fetch Attendance History
  // -------------------------------------------------------------
  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      // Construct query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        date: filters.date,
        subject: filters.subject,
        status: filters.status,
        q: filters.search,
      });

      // Example Endpoint: GET /api/attendance?page=1&limit=10...
      // const response = await fetch(`/api/attendance?${params.toString()}`);
      // if (!response.ok) throw new Error("Failed to fetch records.");
      // const data = await response.json();
      // setRecords(data.records);
      // setTotalRecords(data.total);
      // setTotalPages(data.totalPages);

      // Fallback Mock Data matching image_99d59d.png
      const mockData = [
        {
          id: 1,
          rollNo: "CE-2021-001",
          name: "Arjun Sharma",
          subject: "AI & ML",
          date: "2025-01-15",
          time: "09:02 AM",
          status: "Present",
        },
        {
          id: 2,
          rollNo: "CE-2021-002",
          name: "Priya Patel",
          subject: "AI & ML",
          date: "2025-01-15",
          time: "09:03 AM",
          status: "Present",
        },
        {
          id: 3,
          rollNo: "CE-2021-003",
          name: "Rahul Verma",
          subject: "AI & ML",
          date: "2025-01-15",
          time: "—",
          status: "Absent",
        },
        {
          id: 4,
          rollNo: "CE-2021-004",
          name: "Sneha Kulkarni",
          subject: "DBMS",
          date: "2025-01-15",
          time: "10:15 AM",
          status: "Present",
        },
        {
          id: 5,
          rollNo: "CE-2021-005",
          name: "Amit Joshi",
          subject: "DBMS",
          date: "2025-01-15",
          time: "—",
          status: "Absent",
        },
        {
          id: 6,
          rollNo: "CE-2021-006",
          name: "Kavya Reddy",
          subject: "Networks",
          date: "2025-01-14",
          time: "11:00 AM",
          status: "Present",
        },
        {
          id: 7,
          rollNo: "CE-2021-007",
          name: "Rohan Singh",
          subject: "OS",
          date: "2025-01-14",
          time: "02:05 PM",
          status: "Present",
        },
        {
          id: 8,
          rollNo: "CE-2021-008",
          name: "Meera Nair",
          subject: "SE",
          date: "2025-01-13",
          time: "—",
          status: "Absent",
        },
      ];

      setRecords(mockData);
      setTotalRecords(mockData.length);
      setTotalPages(4);
    } catch (error) {
      console.error("API error fetching attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, [currentPage, filters.date, filters.subject, filters.status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setCurrentPage(1);
  };

  // -------------------------------------------------------------
  // RESTful API Integration: Export Handlers (Excel, CSV, PDF)
  // -------------------------------------------------------------
  const handleExport = async (format) => {
    try {
      // Example Endpoint: GET /api/attendance/export?format=xlsx
      // window.open(`/api/attendance/export?format=${format}&subject=${filters.subject}...`, '_blank');
      alert(`Triggered export to ${format.toUpperCase()} via REST API.`);
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    }
  };

  return (
    <div className="attendance-page-container">
      {/* Top Header Row with Export Buttons */}
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

      {/* Filter and Search Bar Section */}
      <AttendanceFilters
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
      />

      {/* Loading Indicator */}
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
