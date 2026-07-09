from flask import Blueprint, jsonify

from backend.database.database import SessionLocal
from backend.database import crud

student_bp = Blueprint("student", __name__)
@student_bp.route("/students", methods=["GET"])
def get_students():

    db = SessionLocal()

    try:
        students = crud.get_all_students(db)

        data = []

        for student in students:
            data.append({
                "rollno": student.rollno,
                "name": student.name,
                "department": student.department,
                "semester": student.semester
            })

        return jsonify(data)

    finally:
        db.close()