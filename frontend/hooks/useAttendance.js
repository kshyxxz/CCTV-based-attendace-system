// hooks/useAttendance.js
import { useState, useEffect } from "react";
import { attendanceService } from "../services/attendanceServices";

export function useAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    date: "",
    subject: "All",
    status: "All",
    search: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getRecords(currentPage, filters);
      setRecords(data.records || []);
      setTotalRecords(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("API error fetching attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [
    currentPage,
    filters.date,
    filters.subject,
    filters.status,
    filters.search,
  ]);

  return {
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
  };
}
