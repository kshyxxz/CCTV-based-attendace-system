import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import ImageUploader from "./ImageUploader";

export default function StudentForm({ onClose, refreshStudents, apiUrl }) {
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rollNo: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentPayload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        rollNo: formData.rollNo,
        phone: formData.phone,
        embedding: "Pending",
        attendance: 0,
      };

      let bodyData;
      let headers = {};

      if (imageFile) {
        const data = new FormData();
        data.append("studentData", JSON.stringify(studentPayload));
        data.append("avatar", imageFile);
        bodyData = data;
      } else {
        bodyData = JSON.stringify(studentPayload);
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: bodyData,
      });

      if (!response.ok) throw new Error("Failed to save student profile.");

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
          <h2>Add New Student</h2>
          {/* <button className="btn-close" onClick={onClose}> */}
          {/* <FaTimes /> */}
          {/* </button> */}
        </div>

        <form onSubmit={handleFormSubmit} className="modal-form">
          <ImageUploader onImageSelect={(file) => setImageFile(file)} />

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
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="arjunsharma@gmail.com"
              value={formData.email}
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
                placeholder="NCE080BCT018"
                value={formData.rollNo}
                onChange={handleInputChange}
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

          {/* <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select
                name="dept"
                value={formData.dept}
                onChange={handleInputChange}
              >
                <option value="Computer Engg">Computer Engg</option>
                <option value="Electronics Engg">Electronics Engg</option>
              </select>
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select
                name="sem"
                value={formData.sem}
                onChange={handleInputChange}
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="7th Semester">7th Semester</option>
              </select>
            </div>
          </div> */}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
