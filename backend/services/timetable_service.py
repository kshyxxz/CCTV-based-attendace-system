from database.crud import get_timetable, create_timetable
from database.database import get_db

def timetable_service():
	choice = input("Enter 1 to view timetable or 2 to create timetable: ")

	if choice == "1":

		db = next(get_db())

		class_id = int(input("Enter class id : "))

		timetable = get_timetable(db, class_id)

		print(f"Timetable for class {class_id}:")
		for entry in timetable:
			print(f"Subject: {entry.subject.subject_name}, Day: {entry.day_of_week}, Start Time: {entry.start_time}, End Time: {entry.end_time}")

		return timetable

	elif choice == "2":

		db = next(get_db())

		class_id = int(input("Enter class id : "))
		subject_id = int(input("Enter subject id : "))
		day = input("Enter day of week : ")
		start_time = input("Enter start time (HH:MM:SS) : ")
		end_time = input("Enter end time (HH:MM:SS) : ")

		create_timetable(db, class_id, subject_id, day, start_time, end_time)