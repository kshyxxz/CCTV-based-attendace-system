from sqlalchemy.orm import Session
from database.models import ( Student, Embedding, Attendance, Class, Subject, Timetable )
from datetime import time

def create_student(db: Session, data):
	student = Student(**data)
	db.add(student)
	db.commit()
	db.refresh(student)
	
	return student

def get_student(db: Session, rollno: str):
	return (
		db.query(Student).filter(Student.rollno == rollno).first()
	)

def get_all_student(db: Session):
	return db.query(Student).all()

def delete_student(db: Session, rollno: str):
	student = get_student(db, rollno)

	if student:
		db.delete(student)
		db.commit()
		
def save_embeddings(db: Session, rollno: str, embedding_vector):
	embedding = Embedding(rollno=rollno, embedding=embedding_vector)

	db.add(embedding)
	db.commit()
	db.refresh(embedding)

	return embedding

def get_embedding(db: Session, rollno: str):
	return (
		db.query(Embedding).filter(Embedding.rollno == rollno).first()
	)

def get_all_embeddings(db: Session):
	return db.query(Embedding).all()

def mark_attendance(db: Session, rollno: str, attendance_date: str, subject_id: int, status="Present"):
	attendance = Attendance(rollno=rollno, attendance_date=attendance_date, subject=subject_id, status=status)

	db.add(attendance)
	db.commit()
	db.refresh(attendance)

	return attendance

def get_attendance_by_date(db: Session, attendance_date):
	return (
		db.query(Attendance).filter(Attendance.attendance_date == attendance_date).all()
	)

def get_student_attendance(db: Session, rollno: str):
	return (
		db.query(Attendance).filter(Attendance.rollno == rollno).all()
	)

def get_attendance_status(db: Session, rollno: str, date: str, subject_id: int):
	return (
		db.query(Attendance).filter(
			Attendance.rollno == rollno,
			Attendance.subject == subject_id,
			Attendance.attendance_date == date
		).first()
	)

#		classes

def get_class(db, class_id):
	return db.query(Class).filter(Class.class_id == class_id).first()

def get_student_class(db, rollno):
	student = get_student(db, rollno)
	if student:
		return student.class_id
	return None

#		subjects	

def get_subject(db, subject_id):
	return db.query(Subject).filter(Subject.subject_id == subject_id).first()

def get_all_subjects(db):
	return db.query(Subject).all()

def create_subject(db, subject):
	db.add(subject)
	db.commit()
	db.refresh(subject)
	return subject

#		timetable

def get_current_subject(db, class_id, day, time):
	return (
        db.query(Subject)
        .join(
            Timetable,
            Subject.subject_id == Timetable.subject_id
        )
        .filter(
            Timetable.class_id == class_id,
            Timetable.day_of_week == day,
            Timetable.start_time <= time,
            Timetable.end_time >= time,
        )
        .first()
    )

def get_timetable(db, class_id):
    return (
        db.query(Timetable)
        .filter(Timetable.class_id == class_id)
        .order_by(
            Timetable.day_of_week,
            Timetable.start_time
        )
        .all()
    )


def create_timetable(db, class_id: int, subject_id: int, day_of_week: str, start_time: time, end_time: time):

	timetable = Timetable(
        class_id=class_id,
        subject_id=subject_id,
        day_of_week=day_of_week,
        start_time=start_time,
        end_time=end_time,
    )

	db.add(timetable)
	db.commit()
	db.refresh(timetable)

	return timetable