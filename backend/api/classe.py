from flask import Blueprint, jsonify, request
from database.database import SessionLocal
from database.crud import (
	get_all_classes,
	update_class,
	create_class,
	get_class_id,
	delete_class,
	get_class,
	get_class_camera_source,
	set_class_camera_source,
	delete_class_camera_source,
)

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

@class_bp.route("/<class_id>/camera-source", methods=["GET"])
def get_camera_source(class_id):
	db = SessionLocal()

	try:
		class_obj = get_class(db, int(class_id))
		if not class_obj:
			return jsonify({"error": "Class does not exist!"}), 404

		camera_source = get_class_camera_source(db, class_obj.class_id)
		return jsonify({
			"class_id": class_obj.class_id,
			"class_name": class_obj.class_name,
			"camera_source": camera_source,
		}), 200
	except Exception as e:
		return jsonify({"error": f"{e}"}), 500
	finally:
		db.close()

@class_bp.route("/<class_id>/camera-source", methods=["PUT"])
def upsert_camera_source(class_id):
	db = SessionLocal()

	try:
		details = request.get_json() or {}
		camera_source = details.get("camera_source")

		if not camera_source:
			return jsonify({"error": "camera_source is required!"}), 400

		class_obj = get_class(db, int(class_id))
		if not class_obj:
			return jsonify({"error": "Class does not exist!"}), 404

		mapping = set_class_camera_source(db, class_obj.class_id, camera_source)
		return jsonify({
			"message": "Camera source saved successfully!",
			"class_id": mapping.class_id,
			"camera_source": mapping.camera_source,
		}), 200
	except Exception as e:
		return jsonify({"error": f"{e}"}), 500
	finally:
		db.close()

@class_bp.route("/<class_id>/camera-source", methods=["DELETE"])
def remove_camera_source(class_id):
	db = SessionLocal()

	try:
		class_obj = get_class(db, int(class_id))
		if not class_obj:
			return jsonify({"error": "Class does not exist!"}), 404

		delete_class_camera_source(db, class_obj.class_id)
		return jsonify({"message": "Camera source removed successfully!"}), 200
	except Exception as e:
		return jsonify({"error": f"{e}"}), 500
	finally:
		db.close()
	
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
	