from flask import Blueprint, jsonify, request
from database.database import SessionLocal
from database.crud import (
	get_all_classes,
	update_class,
	create_class,
	get_class_id,
	delete_class,
	get_class,
)
from api.recognition import recognition_bp
from vision.camera import load_camera, release_camera, switch_camera

class_bp = Blueprint("classe", __name__)

@class_bp.route("/", methods=["GET"])
def ret_classes():
	db = SessionLocal()

	try:
		classes = get_all_classes(db)

		if classes is not None:
			return jsonify([{
				"class_id": classe.class_id,
				"class_name": classe.class_name,
				"camera_source": classe.camera_source,
			} for classe in classes])
		else:
			return jsonify({"error": "No classes found!"})

	except Exception as e:
		return jsonify({"error": f"{e}"})

@class_bp.route("/", methods=["POST"])
def add_class():
	db = SessionLocal()

	try:
		details = request.get_json() or {}

		create_class(db, details)

		return jsonify({"message": "Class created successfully!"}), 201
	
	except Exception as e:
		return jsonify({"error": f"{e}"}), 500
	finally:
		db.close()
	
@class_bp.route("/", methods=["PUT"])
def change_class():
	db = SessionLocal()

	try:
		details = request.get_json() or {}
		
		update_class(db, details)

		return jsonify({"message": "Class updated successfully!"}), 200
	
	except Exception as e:
		return jsonify({"error": f"{e}"}), 500
	finally:
		db.close()
	
@class_bp.route("/", methods=["DELETE"])
def remove_class():
	db = SessionLocal()

	try:
		details = request.get_json() or {}

		class_id = get_class_id(db, details["class_name"])
		if not get_class(db, class_id):
			return jsonify({"error": "Class does not exist!"}), 404
		
		delete_class(db, details["class_name"])

		return jsonify({"message": "Class deleted successfully!"}), 200
	
	except Exception as e:
		return jsonify({"error": f"{e}"}), 500
	finally:
		db.close()


@class_bp.route("/<class_id>/camera-source", methods=["PUT", "OPTIONS"])
def update_camera_source(class_id):
	if request.method == "OPTIONS":
		return jsonify({"status": "ok"}), 200

	db = SessionLocal()

	try:
		try:
			class_id = int(class_id)
		except (TypeError, ValueError):
			return jsonify({"error": "Invalid class id"}), 400

		classe = get_class(db, class_id)
		if not classe:
			return jsonify({"error": "Class does not exist!"}), 404

		details = request.get_json(silent=True) or {}
		camera_source = details.get("camera_source")

		if camera_source in (None, ""):
			return jsonify({"error": "camera_source is required."}), 400

		# Validate the new source before saving it.
		temp_cap = load_camera(camera_source)
		release_camera(temp_cap)

		new_camera_source = str(camera_source)
		db.query(type(classe)).filter(type(classe).class_id == classe.class_id).update(
			{type(classe).camera_source: new_camera_source},
			synchronize_session=False,
		)
		db.commit()
		db.refresh(classe)

		with recognition_bp.stream_lock:
			if getattr(recognition_bp, "active_class_id", None) == classe.class_id:
				recognition_bp.active_camera_source = new_camera_source
				if getattr(recognition_bp, "streaming", False) and getattr(recognition_bp, "cap", None) is not None:
					recognition_bp.cap = switch_camera(recognition_bp.cap, new_camera_source)

		return jsonify({
			"message": "Camera source updated successfully!",
			"class": {
				"class_id": classe.class_id,
				"class_name": classe.class_name,
				"camera_source": new_camera_source,
			},
		}), 200

	except ValueError as e:
		db.rollback()
		return jsonify({"error": str(e)}), 400
	except Exception as e:
		db.rollback()
		return jsonify({"error": f"{e}"}), 500
	finally:
		db.close()
	