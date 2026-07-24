import { useState } from "react";
import { FaCamera } from "react-icons/fa";

export default function ImageUploader({ onImageSelect }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageSelect(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="photo-upload-container">
      <label htmlFor="photo-input" className="photo-upload-label">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="photo-preview" />
        ) : (
          <div className="photo-placeholder">
            <FaCamera className="camera-icon" />
            <span>Upload Student Photo</span>
          </div>
        )}
      </label>
      <input
        type="file"
        id="photo-input"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
