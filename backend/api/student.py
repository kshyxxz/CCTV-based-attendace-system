from flask import Blueprint, jsonify, request

from database.database import SessionLocal
from database.crud import get_all_student, get_student, create_student, delete_student

student_bp = Blueprint("student", __name__)


@student_bp.route("/", methods=["GET"])
def ret_students():
	db = SessionLocal()
	
	try:
		students = get_all_student(db)
		if students is not None:
			return jsonify([{
				"rollno": student.rollno,
				"fname": student.fname,
				"lname": student.lname,
				"phone": student.phone,
				"address": student.address,
				"class_id": student.class_id
			} for student in students])
		else:
			return {"message": "Empty"}

	except Exception as e:
		print(f"Error: {e}")

@student_bp.route("/<rollno>", methods=["GET"])
def ret_student(rollno):
	db = SessionLocal()

	try:
		student = get_student(db, rollno)
		return jsonify([{
			"rollno": student.rollno,
				"fname": student.fname,
				"lname": student.lname,
				"phone": student.phone,
				"address": student.address,
				"class_id": student.class_id
		}])
	except Exception as e:
		print(f"Error: {e}")

@student_bp.route("/create", methods=["POST"])
def add_student():
	db = SessionLocal()

	try:
		details = request.get_json()

		for detail in details:
			roll = detail["rollno"]
			if get_student(db, roll):
				return jsonify({"message": "Student with this roll number already exists!"})

			create_student(db, detail)

		return jsonify({"message": "Student(s) created successfully!"})
	
	except Exception as e:
		print(f"Error: {e}")

@student_bp.route("/", methods=["DELETE"])
def delete_students():
	db = SessionLocal()

	try:
		details = request.get_json()

		for detail in details:
			if not get_student(db, detail["rollno"]):
				return jsonify({"message": "Student(s) does not exist!"})
			
			delete_student(db, detail["rollno"])
		
		return jsonify({"message": "Student(s) deleted successfully!"})
	
	except Exception as e:
		print(f"Error: {e}")