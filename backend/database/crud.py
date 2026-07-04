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
		