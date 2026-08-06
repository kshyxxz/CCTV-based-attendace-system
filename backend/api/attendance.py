from flask import Blueprint, jsonify, request
from database.crud import get_attendances, get_subject, get_student, get_class_name
from database.database import SessionLocal

attendance_bp = Blueprint("attendance", __name__)

@attendance_bp.route("/", methods=["GET"])
def get_attendance():
	db = SessionLocal()

	try:
		attendances = get_attendances(db)

		return jsonify([{
			"attendance_date": attendance.attendance_date.isoformat(),
			"rollno": attendance.rollno,
			"status": attendance.status,
			"subject_name": get_subject(db, attendance.subject_id).subject_name,
			"student_name": f"{get_student(db, attendance.rollno).fname} {get_student(db, attendance.rollno).lname}",
			"class_name": get_class_name(db, get_student(db, attendance.rollno).class_id)
		} for attendance in attendances])
	
	except Exception as e:
		return jsonify({"error": f"{e}"}), 500
