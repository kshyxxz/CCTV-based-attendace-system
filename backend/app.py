from flask import Flask
from api.attendance import attendance_bp
from api.student import student_bp
from api.subject import subject_bp
from api.classe import class_bp
from api.timetable import timetable_bp

app = Flask(__name__)

app.register_blueprint(student_bp, url_prefix="/students")
app.register_blueprint(subject_bp, url_prefix="/subjects")
app.register_blueprint(class_bp, url_prefix="/classes")
app.register_blueprint(timetable_bp, url_prefix="/timetable")
app.register_blueprint(attendance_bp, url_prefix="/attendance")

@app.route('/')
def intro():
	return "Welcome to the CCTV-based Attendance System!"

if __name__ == '__main__':
	app.run(debug=True)