from database.crud import get_current_subject, get_attendance_status, mark_attendance, get_student_class
from datetime import datetime

def attendance_service(db, matched_students, class_id=None):
    date = datetime.now().date()
    time_now = datetime.now().time()
    day = datetime.now().strftime("%A")

    for rollno in matched_students:
        student_class_id = get_student_class(db, rollno)
        if not student_class_id:
            continue

        if class_id is not None and student_class_id != class_id:
            continue

        subject = get_current_subject(db, student_class_id, day, time_now)

        if subject is None:
            # No subject scheduled at this time → skip or log
            print(f"No subject found for class {student_class_id} at {day} {time_now}")
            continue

        # Only proceed if subject exists
        student_info = get_attendance_status(db, rollno, date, subject.subject_id)
        if not student_info:
            mark_attendance(db, rollno, date, subject.subject_id, status="Present")