# from database.crud import get_subject_name
from database.database import get_db
from services.timetable_service import timetable_service

db = next(get_db())

# print(get_subject_name(db, "Monday", "07:50:00"))

timetable_service()