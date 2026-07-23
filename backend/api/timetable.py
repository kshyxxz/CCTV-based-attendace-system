from flask import Blueprint, jsonify, request

from database.database import SessionLocal
from database.crud import get_all_timetable, create_timetable, get_timetable, delete_timetable

timetable_bp = Blueprint("timetable", __name__)

# TODO: FIX THIS API 

@timetable_bp.route("/", methods=["GET"])
def ret_timetable():
	db = SessionLocal()

	try:
		timetables = get_all_timetable(db)

		if timetables is not None:
			return jsonify([{
				"class_id": timetable.class_id,
				"subject_id": timetable.subject_id,
				"day_of_week": timetable.day_of_week,
				"start_time": timetable.start_time.isoformat(),	# isoformat() time is not JSON serializable
				"end_time": timetable.end_time.isoformat()
			} for timetable in timetables])
		
		else:
			return jsonify({"message": "Timetable is empty!"})

	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@timetable_bp.route("/<timetable_id>", methods=["GET"])
def get_timetable_by_id(timetable_id):
	db = SessionLocal()

	try:
		timetable = get_timetable(db, timetable_id)

		if timetable:
			return jsonify({
				"class_id": timetable.class_id,
				"subject_id": timetable.subject_id,
				"day_of_week": timetable.day_of_week,
				"start_time": timetable.start_time.isoformat(),
				"end_time": timetable.end_time.isoformat()
			})
		else:
			return jsonify({"error": "Timetable not found!"})

	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@timetable_bp.route("/create", methods=["POST"])
def add_timetable():
	db = SessionLocal()

	try:
		details = request.get_json()

		for detail in details:
			create_timetable(db, detail)

		return jsonify({"message": "Timetable(s) created successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
	
@timetable_bp.route("/", methods=["DELETE"])
def delete_timetables():
	db = SessionLocal()

	try:
		details = request.get_json()

		for detail in details:
			if not get_timetable(db, detail["timetable_id"]):
				return jsonify({"error": "Timetable(s) does not exist!"})
			
			delete_timetable(db, detail["timetable_id"])

		return jsonify({"message": "Timetable(s) deleted successfully!"})
	
	except Exception as e:
		return jsonify({"error": f"{e}"})
