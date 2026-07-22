from sqlalchemy.orm import Session
from database.models import ( Student, Embedding, Attendance, Class, Subject, Timetable )
from datetime import time

def create_student(db: Session, data):
    class_id = get_class_id(db, data["class_name"])

    if class_id is None:
        raise ValueError("Class does not exist.")

    data = {**data, "class_id": class_id}
    del data["class_name"]

    student = Student(**data)
    db.add(student)
    db.commit()
    db.refresh(student)

    return student

def get_student(db: Session, rollno: str):
	return (
		db.query(Student).filter(Student.rollno == rollno).first()
	)

def get_all_student(db: Session) -> list[Student]:
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

def get_embedding_status(db: Session, rollno: str):
    return get_embedding(db, rollno) is not None

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

def get_class_id(db: Session, class_name: str):
	class_obj = db.query(Class).filter(Class.class_name == class_name).first()
	return class_obj.class_id if class_obj else None

def get_class_name(db: Session, class_id: int):
    class_obj = db.query(Class).filter(Class.class_id == class_id).first()
    return class_obj.class_name if class_obj else None

def get_all_classes(db: Session):
	return db.query(Class).all()

def create_class(db, data):
	classe = Class(**data)
	db.add(classe)
	db.commit()
	db.refresh(classe)
	return classe

def get_student_class(db, rollno):
	student = get_student(db, rollno)
	if student:
		return student.class_id
	return None

def delete_class(db: Session, classe_id: int):
	classe = get_class(db, classe_id)

	if classe:
		db.delete(classe)
		db.commit()

#		subjects	

def get_subject(db, subject_id):
	return db.query(Subject).filter(Subject.subject_id == subject_id).first()

def get_all_subjects(db: Session):
	return db.query(Subject).all()

def create_subject(db, data):
	subject = Subject(**data)
	db.add(subject)
	db.commit()
	db.refresh(subject)
	return subject

def delete_subject(db: Session, subject_id: int):
	subject = get_subject(db, subject_id)

	if subject:
		db.delete(subject)
		db.commit()	

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

def get_all_timetable(db: Session):
	return (db.query(Timetable).all())

def get_current_timetable(db, class_id):
    return (
        db.query(Timetable)
        .filter(Timetable.class_id == class_id)
        .order_by(
            Timetable.day_of_week,
            Timetable.start_time
        )
        .all()
    )

def get_timetable(db: Session, timetable_id: int):
	return (db.query(Timetable).filter(Timetable.timetable_id == timetable_id).first())


def create_timetable(db, data):
	timetable = Timetable(**data)
	db.add(timetable)
	db.commit()
	db.refresh(timetable)
	return timetable

def delete_timetable(db: Session, timetable_id: int):
	timetable = get_timetable(db, timetable_id)

	if timetable:
		db.delete(timetable)
		db.commit()	

def get_today_counts(db: Session, todays_date):
	total = db.query(Student).count()
	present = db.query(Attendance).filter(Attendance.attendance_date == todays_date, Attendance.status == "Present").count()

	return {
		"present": present,
		"absent": total - present,
		"attendance_rate": (present / total) * 100
	}

from datetime import timedelta

def get_weekly_attendance(db: Session, selected_date):

	days_since_monday = selected_date.weekday() % 7

	monday_that_week = selected_date - timedelta(days=days_since_monday)

	dates = []

	for i in range(5):
		dates.append(monday_that_week + timedelta(i))

	result = []

	for date in dates:
		result.append({
			"date": date.isoformat(),
			"rate": get_today_counts(db, date)["attendance_rate"]
			}
		)

	return result

def get_subject_stats(db: Session, selected_date):

	result = []

	subjects = db.query(Subject).all()

	for subject in subjects:
		count = db.query(Attendance).filter(Attendance.subject_id == subject.subject_id, Attendance.attendance_date == selected_date).count()
		result.append({
			"subject": subject.subject_name,
			"count": count
		})

	return result

# def get_recent_logs(db: Session):
