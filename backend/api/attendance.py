from flask import Blueprint, request, jsonify
import cv2
import numpy as np

from backend.services.recognition_service import recognize_attendance
from backend.services.attendance_service import mark_attendance

attendance_bp = Blueprint("attendance", __name__)


@attendance_bp.route("/attendance", methods=["POST"])
def attendance():

    if "frame" not in request.files:
        return jsonify({
            "success": False,
            "message": "Frame not received"
        }), 400

    image = request.files["frame"]

    file_bytes = np.frombuffer(image.read(), np.uint8)
    frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    student, similarity = recognize_attendance(frame)

    if student is None:
        return jsonify({
            "success": False,
            "message": "No registered student found"
        }), 404

    attendance_record = mark_attendance(student)

    return jsonify({
        "success": True,
        "rollno": student.rollno,
        "name": student.name,
        "similarity": round(similarity, 3),
        "attendance_id": attendance_record.id,
        "status": attendance_record.status
    })