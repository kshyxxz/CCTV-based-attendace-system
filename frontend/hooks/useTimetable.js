import { useState, useEffect, useCallback } from "react";
import { timetableService } from "../services/timetableServices";
import { classService } from "../services/classesServices";

export function useTimetable() {
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch available classes on mount using getClasses()
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await classService.getClasses();
        // Handle array response or nested object response
        const list = Array.isArray(classesData)
          ? classesData
          : classesData.classes || [];

        setClassesList(list);

        // Automatically select the first class if none selected yet
        if (list.length > 0 && !selectedClass) {
          const firstClassName =
            typeof list[0] === "string"
              ? list[0]
              : list[0].class_name || list[0].name;
          setSelectedClass(firstClassName);
        }
      } catch (err) {
        console.error("Failed to load classes for dropdown:", err);
      }
    };

    fetchClasses();
  }, []);

  // 2. Fetch timetable schedule whenever selectedClass changes
  const fetchTimetable = useCallback(async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      setError(null);
      const data = await timetableService.getTimetableByClass(selectedClass);
      setSchedule(data || {});
    } catch (err) {
      // If a class has no schedule/periods created yet, keep schedule empty
      setSchedule({});
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const addPeriod = async (payload) => {
    await timetableService.createPeriod(selectedClass, payload);
    await fetchTimetable();
  };

  const updatePeriod = async (payload) => {
    await timetableService.updatePeriod(selectedClass, payload);
    await fetchTimetable();
  };

  const deletePeriod = async (timetableId) => {
    await timetableService.deletePeriod(selectedClass, timetableId);
    await fetchTimetable();
  };

  return {
    classesList,
    selectedClass,
    setSelectedClass,
    schedule,
    loading,
    error,
    refreshTimetable: fetchTimetable,
    addPeriod,
    updatePeriod,
    deletePeriod,
  };
}
