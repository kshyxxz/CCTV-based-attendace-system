from flask import Flask

app = Flask(__name__)

@app.route('/')
def intro():
	return "Welcome to the CCTV-based Attendance System!"

if __name__ == '__main__':
	app.run(debug=True)