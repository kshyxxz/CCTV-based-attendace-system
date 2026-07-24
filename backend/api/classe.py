from flask import Blueprint, jsonify, request
from database.database import SessionLocal
from database.crud import get_all_classes, update_class, create_class, get_class_id, delete_class, get_class

class_bp = Blueprint("classe", __name__)

@class_bp.route("/", methods=["GET"])
def ret_classes():
	db = SessionLocal()

	try:
		classes = get_all_classes(db)

		if classes is not None:
			return jsonify([{
				"class_name": classe.class_name
			} for classe in classes])
		else:
			return jsonify({"error": "No classes found!"})

	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@class_bp.route("/", methods=["POST"])
def add_class():
	db = SessionLocal()

	try:
		details = request.get_json()
		
		create_class(db, details)

		return jsonify({"message": "Class created successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@class_bp.route("/", methods=["PUT"])
def change_class():
	db = SessionLocal()

	try:
		details = request.get_json()
		
		update_class(db, details)

		return jsonify({"message": "Class updated successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@class_bp.route("/", methods=["DELETE"])
def remove_class():
	db = SessionLocal()

	try:
		details = request.get_json()

		class_id = get_class_id(db, details["class_name"])
		if not get_class(db, class_id):
			return jsonify({"error": "Class does not exist!"})
		
		delete_class(db, details["class_name"])

		return jsonify({"message": "Class deleted successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	