import { useState } from "react";
import { FaFileExcel, FaFileCsv, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";
import { useAttendance } from "../../../hooks/useAttendance";
import "./attendance.css";

function Attendance() {
  const {
    records,
    allFilteredRecords,
    loading,
    totalRecords,
    currentPage,
    setCurrentPage,
    totalPages,
    rollGroups,
    filters,
    setFilters,
  } = useAttendance();
  const [modalState, setModalState] = useState({
    open: false,
    title: "",
    message: "",
  });

  const showNotice = (title, message) => {
    setModalState({ open: true, title, message });
  };

  const closeNotice = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  // Export as CSV
  const exportToCSV = () => {
    if (allFilteredRecords.length === 0) {
      showNotice(
        "No records available",
        "There are no attendance records to export with the current filters.",
      );
      return;
    }

    const headers = ["Roll No", "Student Name", "Subject", "Date"];
    const rows = allFilteredRecords.map((r) => [
      `"${r.rollno}"`,
      `"${r.student_name}"`,
      `"${r.subject_name}"`,
      `"${r.attendance_date}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Attendance_Report_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as Excel (HTML-Blob Table)
  const exportToExcel = () => {
    if (allFilteredRecords.length === 0) {
      showNotice(
        "No records available",
        "There are no attendance records to export with the current filters.",
      );
      return;
    }

    let tableHtml = `<table border="1"><thead><tr><th>Roll No</th><th>Student Name</th><th>Subject</th><th>Date</th></tr></thead><tbody>`;
    allFilteredRecords.forEach((r) => {
      tableHtml += `<tr><td>${r.rollno}</td><td>${r.student_name}</td><td>${r.subject_name}</td><td>${r.attendance_date}</td></tr>`;
    });
    tableHtml += `</tbody></table>`;

    const blob = new Blob([tableHtml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Attendance_Report_${new Date().toISOString().slice(0, 10)}.xls`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as actual PDF download using jsPDF
  const exportToPDF = () => {
    if (allFilteredRecords.length === 0) {
      showNotice(
        "No records available",
        "There are no attendance records to export with the current filters.",
      );
      return;
    }

    // 1. Create PDF document (portrait, millimeters, a4 paper size)
    const doc = new jsPDF("p", "mm", "a4");

    // 2. Add Title
    doc.setFontSize(16);
    doc.text("Attendance Records Report", 14, 15);

    // 3. Define columns and data rows
    const tableColumns = ["Roll No", "Student Name", "Subject", "Date"];
    const tableRows = allFilteredRecords.map((r) => [
      r.rollno,
      r.student_name,
      r.subject_name,
      r.attendance_date,
    ]);

    // 4. Generate table inside the PDF
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59] },
    });

    // 5. Trigger automatic download
    const fileName = `Attendance_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
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
          <button className="btn-export btn-excel" onClick={exportToExcel}>
            <FaFileExcel /> <span>Excel</span>
          </button>
          <button className="btn-export btn-csv" onClick={exportToCSV}>
            <FaFileCsv /> <span>CSV</span>
          </button>
          <button className="btn-export btn-pdf" onClick={exportToPDF}>
            <FaFilePdf /> <span>PDF</span>
          </button>
        </div>
      </div>

      <AttendanceFilters
        filters={filters}
        setFilters={setFilters}
        rollGroups={rollGroups}
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

      {modalState.open && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={closeNotice}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modalState.title}</h3>
              <button
                className="modal-close-btn"
                onClick={closeNotice}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">{modalState.message}</p>
              <div className="modal-actions">
                <button className="btn-modal-primary" onClick={closeNotice}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
