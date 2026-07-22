from flask import Blueprint, jsonify, request
from database.database import SessionLocal
from database.crud import (get_all_student, get_embedding_status, get_class_name, get_student, delete_student, create_student)

student_bp = Blueprint("student", __name__)

@student_bp.route("/", methods=["GET"])
def ret_students():
    db = SessionLocal()

    try:
        students = get_all_student(db)

        if not students:
            return jsonify({"message": "Empty"})

        return jsonify([
            {
                "rollno": student.rollno,
                "name": f"{student.fname} {student.lname}",
                "phone": student.phone,
                "embedding": get_embedding_status(db, student.rollno),
                "address": student.address,
                "class_name": get_class_name(db, student.class_id),
            }
            for student in students
        ])

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500

    finally:
        db.close()

@student_bp.route("/<rollno>", methods=["GET"])
def ret_student(rollno):
	db = SessionLocal()

	try:
		student = get_student(db, rollno)

		if not student:
			return jsonify({"message": "Student does not exist!"})
		return jsonify(
			{
				"rollno": student.rollno,
                "name": f"{student.fname} {student.lname}",
                "phone": student.phone,
                "embedding": get_embedding_status(db, student.rollno),
                "address": student.address,
                "class_name": get_class_name(db, student.class_id),
		})
	except Exception as e:
		return jsonify({"message": "An error occurred while fetching the student."})

@student_bp.route("/create", methods=["POST"])
def add_student():
	db = SessionLocal()

	try:
		details = request.get_json()

		roll = details["rollno"]
		if get_student(db, roll):
			return jsonify({"message": "Student with this roll number already exists!"})

		create_student(db, details)

		return jsonify({"message": "Student(s) created successfully!"})
	
	except Exception as e:
		return jsonify({"message": "An error occurred while creating the student."})

@student_bp.route("/", methods=["PUT"])
def update_student():
	db = SessionLocal()

	try:
		details = request.get_json()
		roll = details["rollno"]

		student = get_student(db, roll)

		if not student:
			return jsonify({"message": "Student does not exist!"})

		student.fname = details.get("fname", student.fname)
		student.lname = details.get("lname", student.lname)
		student.phone = details.get("phone", student.phone)
		student.address = details.get("address", student.address)
		student.class_id = details.get("class_id", student.class_id)

		db.commit()
		
		return jsonify({"message": "Student updated successfully!"})
	
	except Exception as e:
		return jsonify({"message": "An error occurred while updating the student."})

@student_bp.route("/", methods=["DELETE"])
def delete_students():
	db = SessionLocal()

	try:
		details = request.get_json()

		if not get_student(db, details["rollno"]):
			return jsonify({"message": "Student(s) does not exist!"})
		
		delete_student(db, details["rollno"])
		
		return jsonify({"message": "Student(s) deleted successfully!"})
	
	except Exception as e:
		return jsonify({"message": "An error occurred while deleting the student."})