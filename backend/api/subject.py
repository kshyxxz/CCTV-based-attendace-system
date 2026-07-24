from flask import Blueprint, jsonify, request
from database.database import SessionLocal
from database.crud import update_subject, get_subject, get_subject_by_code, get_all_subjects, create_subject, delete_subject

subject_bp = Blueprint("subject", __name__)

@subject_bp.route("/", methods=["GET"])
def ret_subjects():
	db = SessionLocal()

	try:
		subjects = get_all_subjects(db)

		if subjects is not None:
			return jsonify([{
				"subject_id": subject.subject_id,
				"subject_code": subject.subject_code,
				"subject_name": subject.subject_name
			} for subject in subjects])
		else:
			return jsonify({"message": "No subject(s) in the database!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@subject_bp.route("/", methods=["POST"])
def add_subject():
	db = SessionLocal()

	try:
		details = request.get_json()

		subject_code = details["subject_code"]
		if get_subject_by_code(db, subject_code):
			return jsonify({"error": "Subject already exists"})
		
		create_subject(db, details)

		return jsonify({"message": "Subject created successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})

@subject_bp.route("/", methods=["PUT"])
def change_subject():
	db = SessionLocal()

	try:
		details = request.get_json()

		subject_id = details["subject_id"]
		if get_subject(db, subject_id):

			update_subject(db, details)

			return jsonify({"message": "Subject updated successfully!"})

		return jsonify({"error": "Subject does not exist!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})

@subject_bp.route("/", methods=["DELETE"])
def delete_subjects():
	db = SessionLocal()

	try:
		details = request.get_json()

		if not get_subject(db, details["subject_id"]):
			return jsonify({"error": "Subject does not exist!"})
		
		delete_subject(db, details["subject_id"])

		return jsonify({"message": "Subject deleted successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
