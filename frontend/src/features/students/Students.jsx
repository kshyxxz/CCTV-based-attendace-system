import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import StudentTable from "./StudentTable";
import StudentForm from "./StudentForm";
import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = "http://localhost:5000/api/students"; // Set explicitly to your port

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch students data.");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="student-container">
      {/* Top Header Section */}
      <div className="student-header">
        <div>
          <h1>Student Management</h1>
          <p className="subtitle">{students.length} students enrolled</p>
        </div>
        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Add Student
        </button>
      </div>

      {/* Filter and Search Action Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* <div className="filter-group-actions">
          <select className="filter-select">
            <option>All Departments</option>
          </select>
          <select className="filter-select">
            <option>All Semesters</option>
          </select>
        </div> */}
      </div>

      {/* Loading & Error Indicators */}
      {loading && <div className="status-message">Loading profiles...</div>}
      {error && <div className="status-message error-text">Error: {error}</div>}

      {/* Students Data Table Subcomponent */}
      {!loading && !error && (
        <StudentTable filteredStudents={filteredStudents} />
      )}

      {/* Form Dialog Modal Overlay */}
      {isModalOpen && (
        <StudentForm
          onClose={() => setIsModalOpen(false)}
          refreshStudents={fetchStudents}
          apiUrl={API_URL}
        />
      )}
    </div>
  );
}

export default Students;
