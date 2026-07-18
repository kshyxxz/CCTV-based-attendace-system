from flask import Blueprint, jsonify, request

from database.database import SessionLocal
from database.crud import get_subject, get_all_subjects, create_subject, delete_subject

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
	
@subject_bp.route("/<id>", methods=["GET"])
def ret_subject(id):
	db = SessionLocal()

	try:
		subject = get_subject(db, id)

		if not subject:
			return jsonify({"error": "Subject does not exist!"})
		
		return jsonify({
			"subject_id": subject.subject_id,
			"subject_code": subject.subject_code,
			"subject_name": subject.subject_name,
		})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@subject_bp.route("/create", methods=["POST"])
def add_subject():
	db = SessionLocal()

	try:
		details = request.get_json()

		for detail in details:
			subject_id = detail["subject_id"]
			if get_subject(db, subject_id):
				return jsonify({"error": "Subject already exists"})
			
			create_subject(db, detail)

		return jsonify({"message": "Subject(s) created successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@subject_bp.route("/", methods=["DELETE"])
def delete_subjects():
	db = SessionLocal()

	try:
		details = request.get_json()

		for detail in details:
			if not get_subject(db, detail["subject_id"]):
				return jsonify({"error": "Subject(s) does not exist!"})
			
			delete_subject(db, detail["subject_id"])

		return jsonify({"message": "Subject(s) deleted successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
