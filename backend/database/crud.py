from sqlalchemy.orm import Session
from database.models import ( Student, Embedding, Attendance )

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

def mark_attendance(db: Session, rollno: str, attendance_date, day, subject, status="Present"):
	attendance = Attendance(rollno=rollno, attendance_date=attendance_date, day=day, subject=subject, status=status)

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