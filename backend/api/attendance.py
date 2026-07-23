from datetime import date

from flask import Blueprint, jsonify, request

from database.database import SessionLocal
from services.dashboard_service import get_dashboard_summary

attendance_bp = Blueprint("attendance", __name__)

@attendance_bp.route("/summary", methods=["GET"])
def summary():
	db = SessionLocal()

	todays_date = date.today()

	return jsonify(get_dashboard_summary(db, todays_date))