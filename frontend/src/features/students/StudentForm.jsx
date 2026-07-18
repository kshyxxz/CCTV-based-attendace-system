// StudentForm.jsx
import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import { studentService } from "../../../services/studentServices";

export default function StudentForm({ studentData, onClose, refreshStudents }) {
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    rollNo: "",
    phone: "",
  });

  const isEditMode = !!studentData; // true if editing, false if creating a new student

  // 1. Populate form fields if we are in Edit Mode
  useEffect(() => {
    if (studentData) {
      // Split "First Last" safely back into individual inputs
      const nameParts = (studentData.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || ""; // Handles multi-word last names

      setFormData({
        firstName,
        lastName,
        address: studentData.address || "",
        rollNo: studentData.rollNo || "",
        phone: studentData.phone || "",
      });
    }
  }, [studentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentPayload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email:
          studentData?.email ||
          `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@student.edu`,
        rollNo: formData.rollNo,
        phone: formData.phone,
        address: formData.address,
        embedding: studentData?.embedding || "Pending", // Keep old status if editing
        attendance: studentData?.attendance || 0, // Keep old attendance rate if editing
      };

      if (isEditMode) {
        // Use the PUT route targeting the unique id or roll number
        const studentId = studentData.id || studentData.rollNo;
        await studentService.updateStudent(
          studentId,
          studentPayload,
          imageFile,
        );
      } else {
        // Fallback to the standard POST route
        await studentService.saveStudent(studentPayload, imageFile);
      }

      refreshStudents();
      onClose();
    } catch (err) {
      alert(`Error saving student: ${err.message}`);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditMode ? "Edit Student Profile" : "Add New Student"}</h2>
        </div>

        <form onSubmit={handleFormSubmit} className="modal-form">
          <ImageUploader
            onImageSelect={(file) => setImageFile(file)}
            defaultImage={studentData?.avatar} // Optional: display existing avatar if your Uploader supports it
          />

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="Arjun"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="Sharma"
                value={formData.lastName}
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
              placeholder="Talchikhel, Lalitpur"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                name="rollNo"
                required
                disabled={isEditMode} // Roll Numbers shouldn't change during edits
                placeholder="NCE080BCT018"
                value={formData.rollNo}
                onChange={handleInputChange}
                style={{ backgroundColor: isEditMode ? "#f3f4f6" : "#ffffff" }}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                placeholder="986543210"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {isEditMode ? "Save Changes" : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
