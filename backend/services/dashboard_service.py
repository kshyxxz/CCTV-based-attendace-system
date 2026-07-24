from datetime import date

from database.crud import get_today_counts, get_weekly_attendance, get_subject_stats

def get_dashboard_summary(db, todays_date):

    return {
        "today": get_today_counts(db, todays_date),
        "weekly_trend": get_weekly_attendance(db, todays_date),
        "subject_distribution": get_subject_stats(db, todays_date),
        # "recent_logs": get_recent_logs(db)
    }
