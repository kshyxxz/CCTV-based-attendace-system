import { useState, useEffect, useMemo } from "react";
import { attendanceService } from "../services/attendanceServices";

const getRollGroup = (rollno) => String(rollno || "").trim().slice(3, -3);

export function useAttendance() {
  const [rawRecords, setRawRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    date: "",
    subject: "All",
    rollGroup: "All",
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getRecords(filters);
      const records = Array.isArray(data) ? data : data.records || [];
      // The attendance API provides rollno, e.g. NCE080BCT018.
      // Store its middle portion (080BCT) for display and filtering.
      setRawRecords(
        records.map((record) => ({
          ...record,
          rollGroup: getRollGroup(record.rollno),
        })),
      );
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

  const rollGroups = useMemo(
    () =>
      [...new Set(rawRecords.map((record) => record.rollGroup).filter(Boolean))].sort(),
    [rawRecords],
  );

  // Client-side filtering by date, subject, and roll-number group.
  const filteredRecords = useMemo(() => {
    return rawRecords.filter((record) => {
      // Filter by Date
      if (filters.date && record.attendance_date !== filters.date) {
        return false;
      }
      // Filter by Subject
      if (
        filters.subject !== "All" &&
        record.subject_name?.toLowerCase() !== filters.subject.toLowerCase()
      ) {
        return false;
      }
      if (
        filters.rollGroup !== "All" &&
        record.rollGroup !== filters.rollGroup
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
    rollGroups,
    filters,
    setFilters,
  };
}
