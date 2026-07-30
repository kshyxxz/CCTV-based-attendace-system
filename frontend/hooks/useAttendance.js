import { useState, useEffect, useMemo } from "react";
import { attendanceService } from "../services/attendanceServices";

export function useAttendance() {
  const [rawRecords, setRawRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    date: "",
    subject: "All",
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getRecords(filters);
      setRawRecords(Array.isArray(data) ? data : data.records || []);
    } catch (error) {
      console.error("API error fetching attendance records:", error);
      setRawRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    setCurrentPage(1);
  }, [filters.date, filters.subject]);

  // Client-side filtering by date and subject
  const filteredRecords = useMemo(() => {
    return rawRecords.filter((record) => {
      // Filter by Date
      if (filters.date && record.attendance_date !== filters.date) {
        return false;
      }
      // Filter by Subject/Class
      if (
        filters.subject !== "All" &&
        record.subject_name?.toLowerCase() !== filters.subject.toLowerCase()
      ) {
        return false;
      }
      return true;
    });
  }, [rawRecords, filters]);

  // Pagination logic
  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRecords.slice(startIndex, startIndex + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  return {
    records: paginatedRecords,
    allFilteredRecords: filteredRecords,
    loading,
    totalRecords,
    currentPage,
    setCurrentPage,
    totalPages,
    filters,
    setFilters,
  };
}
