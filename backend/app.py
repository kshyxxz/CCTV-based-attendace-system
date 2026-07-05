from flask import Flask
from database.database import get_db

app = Flask(__name__)

@app.route('/')
def intro():
	return "Welcome to the CCTV-based Attendance System!"

if __name__ == '__main__':
	app.run(debug=True)