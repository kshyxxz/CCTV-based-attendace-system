from flask import Blueprint, jsonify, request

from database.database import SessionLocal
from database.crud import get_all_classes, get_class, create_class, delete_class

class_bp = Blueprint("classe", __name__)

@class_bp.route("/", methods=["GET"])
def ret_classes():
	db = SessionLocal()

	try:
		classes = get_all_classes(db)

		if classes is not None:
			return jsonify([{
				"class_id": classe.class_id,
				"class_name": classe.class_name
			} for classe in classes])
		else:
			return jsonify({"error": "No classes found!"})

	except Exception as e:
		return jsonify({"error": f"{e}"})
		
@class_bp.route("/<class_id>", methods=["GET"])
def ret_classe(class_id):
	db = SessionLocal()

	try:
		classe = get_class(db, class_id)

		if not classe:
			return jsonify({"error": "Class not found!"})
		
		return jsonify({
			"class_id": classe.class_id,
			"class_name": classe.class_name
		})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@class_bp.route("/create", methods=["POST"])
def add_class():
	db = SessionLocal()

	try:
		details = request.get_json()

		for detail in details:
			class_id = detail["class_id"]
			if get_class(db, class_id):
				return jsonify({"error": "Class already exists"})
			
			create_class(db, detail)

		return jsonify({"message": "Class(s) created successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@class_bp.route("/", methods=["DELETE"])
def delete_classes():
	db = SessionLocal()

	try:
		details = request.get_json()

		for detail in details:
			if not get_class(db, detail["class_id"]):
				return jsonify({"error": "Class(s) does not exist!"})
			
			delete_class(db, detail["class_id"])

		return jsonify({"message": "Class(es) deleted successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	