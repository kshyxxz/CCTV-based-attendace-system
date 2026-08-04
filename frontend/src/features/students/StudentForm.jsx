import { useState, useEffect } from "react";
import { studentService } from "../../../services/studentServices";
import ImageUploader from "./ImageUploader";

export default function StudentForm({ studentData, onClose, refreshStudents }) {
  const isEditMode = !!studentData;

  const [classList, setClassList] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    rollno: "",
    fname: "",
    lname: "",
    class_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        setLoadingClasses(true);
        const classesData = await studentService.getClasses();
        const names = (classesData || []).map((c) => c.class_name);
        setClassList(names);

        if (!studentData && names.length > 0) {
          setFormData((prev) => ({ ...prev, class_name: names[0] }));
        }
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClassOptions();
  }, [studentData]);

  useEffect(() => {
    if (studentData) {
      const nameParts = (studentData.name || "").trim().split(" ");
      const fname = nameParts[0] || "";
      const lname = nameParts.slice(1).join(" ") || "";

      setFormData({
        rollno: studentData.rollno || "",
        fname: fname,
        lname: lname,
        class_name: studentData.class_name || "",
        phone: studentData.phone || "",
        address: studentData.address || "",
      });
    }
  }, [studentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file) => {
    setSelectedFile(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.class_name) {
      alert("Please select a valid class.");
      return;
    }

    try {
      if (isEditMode) {
        await studentService.updateStudent(formData);
      } else {
        if (!selectedFile) {
          alert("Please upload a student photo.");
          return;
        }

        const formDataPayload = new FormData();
        formDataPayload.append("rollno", formData.rollno);
        formDataPayload.append("fname", formData.fname);
        formDataPayload.append("lname", formData.lname);
        formDataPayload.append("class_name", formData.class_name);
        formDataPayload.append("phone", formData.phone);
        formDataPayload.append("address", formData.address);
        formDataPayload.append("photo", selectedFile);

        await studentService.saveStudent(formDataPayload);
      }

      await refreshStudents();
      onClose();
    } catch (err) {
      alert(`Error saving student profile: ${err.message}`);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditMode ? "Edit Student Profile" : "Add New Student"}</h2>
        </div>

        <form onSubmit={handleFormSubmit} className="modal-form">
          {!isEditMode && <ImageUploader onImageSelect={handleImageSelect} />}

          <div className="form-group">
            <label>Roll Number</label>
            <input
              type="text"
              name="rollno"
              required
              disabled={isEditMode}
              placeholder="NCE080BCT103"
              value={formData.rollno}
              onChange={handleInputChange}
              style={{ backgroundColor: isEditMode ? "#f3f4f6" : "#ffffff" }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="fname"
                required
                placeholder="Nylon"
                value={formData.fname}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lname"
                required
                placeholder="Sharma"
                value={formData.lname}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Class Name</label>
              <select
                name="class_name"
                value={formData.class_name}
                onChange={handleInputChange}
                required
                disabled={loadingClasses || classList.length === 0}
              >
                {loadingClasses ? (
                  <option value="">Loading classes...</option>
                ) : classList.length === 0 ? (
                  <option value="">No classes available</option>
                ) : (
                  classList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                placeholder="9845118910"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              required
              placeholder="Bhaktapur"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loadingClasses || classList.length === 0}
            >
              {isEditMode ? "Save Changes" : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
