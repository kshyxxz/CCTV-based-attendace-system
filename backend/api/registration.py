from flask import Blueprint, request, jsonify
import os
from backend.services.embedding_service import register_student

registration_bp = Blueprint("registration", __name__)
@registration_bp.route("/register", methods=["POST"])
def register():

    if "video" not in request.files:
        return jsonify({
            "success": False,
            "message": "No video uploaded"
        }), 400

    video = request.files["video"]

    rollno = request.form.get("rollno")

    if not rollno:
        return jsonify({
            "success": False,
            "message": "Roll number is required"
        }), 400

    upload_folder = "backend/uploads/videos"
    os.makedirs(upload_folder, exist_ok=True)

    video_path = os.path.join(upload_folder, video.filename)
    video.save(video_path)

    embedding_count = register_student(
        video_path=video_path,
        rollno=rollno
    )

    return jsonify({
        "success": True,
        "message": "Registration completed",
        "rollno": rollno,
        "embeddings_saved": embedding_count
    })