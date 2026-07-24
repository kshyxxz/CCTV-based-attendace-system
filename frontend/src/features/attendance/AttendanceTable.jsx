import { FaRegCalendarAlt } from "react-icons/fa";

function AttendanceTable({
  records,
  totalRecords,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="table-wrapper">
      <div className="scrollable-table">
        <table className="attendance-table-element">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-state">
                  No attendance records found matching your filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td className="cell-roll">{record.rollNo}</td>
                  <td className="cell-name">{record.name}</td>
                  <td className="cell-subject">{record.subject}</td>
                  <td className="cell-date">
                    <span className="date-badge">
                      <FaRegCalendarAlt className="calendar-icon-inline" />
                      {record.date}
                    </span>
                  </td>
                  <td className="cell-time">{record.time}</td>
                  <td className="cell-status">
                    <span
                      className={`status-tag ${record.status.toLowerCase()}`}
                    >
                      <span className="tag-dot"></span>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination / Records Counter Footer */}
      <div className="table-footer">
        <div className="records-counter">{totalRecords} records found</div>
        <div className="pagination-group">
          <button
            className="btn-page-step"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn-page-number ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="btn-page-step"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendanceTable;
