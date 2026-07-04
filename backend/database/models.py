from sqlalchemy import( Column, String, Integer, Text, Date, ForeignKey )
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from database.database import Base

class Student(Base):
	__tablename__ = "student"

	rollno = Column(String(20), primary_key=True)
	fname = Column(String(50), nullable=False)
	lname = Column(String(50), nullable=False)
	phone = Column(String(15))
	address = Column(Text)

	embedding = relationship("Embedding", back_populates="student", uselist=False, cascade="all, delete")
	attendance = relationship("Attendance", back_populates="student", cascade="all, delete")

class Embedding(Base):
	__tablename__ = "embeddings"

	rollno = Column(String(20), ForeignKey("student.rollno"), primary_key=True)
	embedding = Column(Vector(128), nullable=False)

	student = relationship("Student", back_populates="embedding")

class Attendance(Base):
	__tablename__ = "attendance"

	attendance_id = Column(Integer, primary_key=True)
	rollno = Column(String(20), ForeignKey("student.rollno"), nullable=False)
	attendance_date = Column(Date, nullable=False)
	day = Column(String(10), nullable=False)
	subject = Column(String(100), nullable=False)
	status = Column(String(10), nullable=False)

	student = relationship("Student", back_populates="attendance")