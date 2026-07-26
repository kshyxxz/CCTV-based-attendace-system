from flask import Blueprint, jsonify, request

from database.database import SessionLocal
from database.crud import get_subject_by_code, create_timetable, get_class_timetable, get_timetable, delete_timetable

timetable_bp = Blueprint("timetable", __name__)
	
@timetable_bp.route("/<class_name>", methods=["GET"])
def get_timetable_by_id(class_name):
	db = SessionLocal()

	try:
		timetable = get_class_timetable(db, class_name)

		if timetable:
			return jsonify(timetable)
		else:
			return jsonify({"error": "Timetable not found!"})

	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@timetable_bp.route("/<class_name>/create", methods=["POST"])
def add_timetable(class_name):
	db = SessionLocal()

	try:
		details = request.get_json()

		create_timetable(db, details)

		return jsonify({"message": "Timetable created successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})

@timetable_bp.route("/<class_name>", methods=["PUT"])
def update_timetable(class_name):
	db = SessionLocal()

	try:
		details = request.get_json()
		timetable_id = details.get("timetable_id")
		subject_code = details.get("subject_code")

		timetable = get_timetable(db, timetable_id)

		if not timetable:
			return jsonify({"error": "Timetable not found!"})

		subject = get_subject_by_code(db, subject_code)

		if not subject:
			return jsonify({"error": "Subject not found"}), 404

		timetable.subject_id = subject.subject_id
		
		db.commit()

		return jsonify({"message": "Timetable updated successfully!"})

	except Exception as e:
		return jsonify({"error": f"{e}"})

@timetable_bp.route("/<class_name>", methods=["DELETE"])
def delete_timetables(class_name):
	db = SessionLocal()

	try:
		details = request.get_json()

		delete_timetable(db, details["timetable_id"])

		return jsonify({"message": "Timetable deleted successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
