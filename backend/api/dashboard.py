from flask import Blueprint, jsonify, request
from database.database import SessionLocal
from services.dashboard_service import get_dashboard_summary
from datetime import date

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
def get_dashboard():
	db = SessionLocal()

	today = date.today()

	return jsonify(get_dashboard_summary(db, today))