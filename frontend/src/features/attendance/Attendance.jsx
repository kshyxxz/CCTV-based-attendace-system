import { FaFileExcel, FaFileCsv, FaFilePdf } from "react-icons/fa";
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
    filters,
    setFilters,
  } = useAttendance();

  // Export as CSV
  const exportToCSV = () => {
    if (allFilteredRecords.length === 0) {
      alert("No records to export!");
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
      alert("No records to export!");
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

  // Export as Printable PDF
  const exportToPDF = () => {
    if (allFilteredRecords.length === 0) {
      alert("No records to export!");
      return;
    }

    const printWindow = window.open("", "_blank");
    let html = `
      <html>
        <head>
          <title>Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #1e293b; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 14px; }
            th { background-color: #f1f5f9; }
          </style>
        </head>
        <body>
          <h2>Attendance Records Report</h2>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Subject</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
    `;

    allFilteredRecords.forEach((r) => {
      html += `
        <tr>
          <td>${r.rollno}</td>
          <td>${r.student_name}</td>
          <td>${r.subject_name}</td>
          <td>${r.attendance_date}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
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

      <AttendanceFilters filters={filters} setFilters={setFilters} />

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
