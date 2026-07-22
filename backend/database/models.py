from sqlalchemy import Column, String, Integer, Text, Date, Time, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from database.database import Base


# =====================================================
# CLASSES
# =====================================================
class Class(Base):
    __tablename__ = "classes"

    class_id = Column(Integer, primary_key=True)
    class_name = Column(String(50), unique=True, nullable=False)

    students = relationship("Student", back_populates="student_class", cascade="all, delete")
    timetable = relationship("Timetable", back_populates="student_class", cascade="all, delete")


# =====================================================
# SUBJECTS
# =====================================================
class Subject(Base):
    __tablename__ = "subjects"

    subject_id = Column(Integer, primary_key=True)
    subject_code = Column(String(20), unique=True, nullable=False)
    subject_name = Column(String(100), nullable=False)

    timetable = relationship("Timetable", back_populates="subject", cascade="all, delete")
    attendance = relationship("Attendance", back_populates="subject", cascade="all, delete")


# =====================================================
# STUDENT
# =====================================================
class Student(Base):
    __tablename__ = "student"

    rollno = Column(String(20), primary_key=True)
    fname = Column(String(50), nullable=False)
    lname = Column(String(50), nullable=False)
    phone = Column(String(15))
    address = Column(Text)
    class_id = Column(Integer, ForeignKey("classes.class_id"), nullable=False)

    student_class = relationship("Class", back_populates="students")
    embedding = relationship("Embedding", back_populates="student", uselist=False, cascade="all, delete")
    attendance = relationship("Attendance", back_populates="student", cascade="all, delete")


# =====================================================
# EMBEDDINGS
# =====================================================
class Embedding(Base):
    __tablename__ = "embeddings"

	rollno = Column(String(20), ForeignKey("student.rollno"), primary_key=True)
	embedding = Column(Vector(128), nullable=False)

    student = relationship("Student", back_populates="embedding")


# =====================================================
# TIMETABLE
# =====================================================
class Timetable(Base):
    __tablename__ = "timetable"

    __table_args__ = (
    UniqueConstraint(
        "class_id",
        "day_of_week",
        "start_time",
        name="unique_timetable_slot",
    ),
)

    timetable_id = Column(Integer, primary_key=True)
    class_id = Column(Integer, ForeignKey("classes.class_id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=False)
    day_of_week = Column(String(10), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    student_class = relationship("Class", back_populates="timetable")
    subject = relationship("Subject", back_populates="timetable")


# =====================================================
# ATTENDANCE
# =====================================================
class Attendance(Base):
    __tablename__ = "attendance"
    
    __table_args__ = (
        UniqueConstraint(
            "rollno",
            "attendance_date",
            "subject_id",
            name="unique_attendance",
        ),
    )

    attendance_id = Column(Integer, primary_key=True)
    rollno = Column(String(20), ForeignKey("student.rollno"), nullable=False)
    attendance_date = Column(Date, nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=False)
    status = Column(String(10), nullable=False)

    student = relationship("Student", back_populates="attendance")
    subject = relationship("Subject", back_populates="attendance")