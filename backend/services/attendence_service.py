from datetime import datetime
from database.crud import mark_attendance, get_attendance_status, get_current_subject, get_student_class

def attendance_service(db, matched_students):	 

	now = datetime.now()

	for matched_student in matched_students:  
		"""
		matches = [
			{
				"student": "NCE080BCT019",
				"embedding_index": 0,
				"similarity": 0.94,
			},
			{
				"student": "NCE080BCT025",
				"embedding_index": 3,
				"similarity": 0.89,
			},
			{
				"student": "Unknown",
				"embedding_index": -1,
				"similarity": 0.42,
			},
			{
				"student": "NCE080BCT012",
				"embedding_index": 1,
				"similarity": 0.91,
			},
		]
		"""

		rollno = matched_student

		date = now.date()

		day =	now.strftime("%A")

		time = now.strftime("%H:%M:%S")

		class_id = get_student_class(db, rollno)
		subject = get_current_subject(db, class_id, day, time)

		student_info = get_attendance_status(db, rollno, date, subject.subject_id)
		if student_info is None:
			mark_attendance(db, rollno, date, subject.subject_id)
		else:
			# print(f"{rollno} is already marked {student_info.status}")
			pass