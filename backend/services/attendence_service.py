# backend/services/attendance_service.py
from datetime import datetime
from backend.database.models import Attendance
from backend.database.database import db_session

def mark_attendance(student):
    """
    Mark attendance for a recognized student.
    """
    if student is None:
        return None

    record = Attendance(
    rollno=student.rollno,
    attendance_date=datetime.now().date(),
    day=datetime.now().strftime("%A"),
    subject="General",   # or pass from API
    status="Present"
   )
    db_session.add(record)
    db_session.commit()
    return record
