import threading
import cv2
import time
from typing import Any
from flask import Blueprint, request, jsonify, Response
from database.models import Class
from database.crud import get_class, get_class_id, get_class_camera_source
from services.recognition_service import process_frame, decode_image
from database.database import get_db
from config import CAMERA_SOURCE

recognition_bp: Any = Blueprint("recognition", __name__)
recognition_bp.active_class_id = None
recognition_bp.active_class_name = ""
recognition_bp.active_camera_source = CAMERA_SOURCE
recognition_bp.cap = None
recognition_bp.streaming = False
recognition_bp.stream_lock = threading.Lock()
recognition_bp.latest_stats = {"detected": 0, "recognized": 0, "unknown": 0, "fps": 0}
recognition_bp.latest_logs = []


def _parse_class_id(raw_class_id):
    if raw_class_id in (None, ""):
        return None

    try:
        return int(raw_class_id)
    except (TypeError, ValueError):
        return None


def _set_active_class(db, raw_class_id):
    class_id = _parse_class_id(raw_class_id)
    if class_id is None:
        return None, None

    class_obj = get_class(db, class_id)
    if not class_obj:
        return None, None

    recognition_bp.active_class_id = class_obj.class_id
    recognition_bp.active_class_name = class_obj.class_name
    recognition_bp.active_camera_source = get_class_camera_source(db, class_obj.class_id, fallback=CAMERA_SOURCE)
    return class_obj.class_id, class_obj.class_name

@recognition_bp.route("", methods=["POST", "OPTIONS"])
@recognition_bp.route("/", methods=["POST", "OPTIONS"])
def recognize():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.get_json() or {}
    image_payload = data.get("image")
    class_name = data.get("class_name") or data.get("selectedClass") or ""

    if not image_payload:
        return jsonify({"success": False, "error": "No image payload provided"}), 400

    img = decode_image(image_payload)
    if img is None:
        return jsonify({"success": False, "error": "Invalid base64 image data"}), 400

    db_gen = get_db()
    db = next(db_gen)
    try:
        class_id = data.get("class_id") or recognition_bp.active_class_id
        if class_id is None and class_name:
            class_id = get_class_id(db, class_name)
        result = process_frame(img, db, class_id=class_id, class_name=class_name)
    finally:
        db_gen.close()

    detections = result.get("detections", [])
    logs = result.get("logs", [])

    recognized_count = sum(1 for d in detections if d.get("recognized"))
    unknown_count = len(detections) - recognized_count

    return jsonify({
        "success": True,
        "detections": detections,
        "logs": logs,
        "stats": {
            "detected": len(detections),
            "recognized": recognized_count,
            "unknown": unknown_count,
        }
    })


# ---------------------------------------------------------------------------
# Streaming control routes
# ---------------------------------------------------------------------------

@recognition_bp.route("/stream/start", methods=["POST", "OPTIONS"])
def stream_start():
    """Signal the backend to open the camera and begin streaming."""
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    payload = request.get_json(silent=True) or {}
    raw_class_id = request.args.get("class_id") or payload.get("class_id")

    db_gen = get_db()
    db = next(db_gen)
    try:
        class_id, class_name = _set_active_class(db, raw_class_id)
        if raw_class_id is not None and class_id is None:
            return jsonify({"success": False, "error": "Class not found"}), 404
    finally:
        db_gen.close()

    with recognition_bp.stream_lock:
        recognition_bp.streaming = True
        recognition_bp.latest_stats = {"detected": 0, "recognized": 0, "unknown": 0, "fps": 0}
        recognition_bp.latest_logs = []
    return jsonify({
        "status": "started",
        "source": str(recognition_bp.active_camera_source),
        "class_id": class_id,
        "class_name": class_name,
    }), 200


@recognition_bp.route("/stream/stop", methods=["GET", "OPTIONS"])
def stream_stop():
    """Signal the backend to stop streaming and release the camera."""
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    with recognition_bp.stream_lock:
        recognition_bp.streaming = False
        recognition_bp.latest_stats = {"detected": 0, "recognized": 0, "unknown": 0, "fps": 0}
        recognition_bp.latest_logs = []
        recognition_bp.active_class_id = None
        recognition_bp.active_class_name = ""
        recognition_bp.active_camera_source = CAMERA_SOURCE
    return jsonify({"status": "stopped"}), 200


@recognition_bp.route("/video_feed", methods=["GET"])
def video_feed():
    """MJPEG streaming endpoint consumed by the frontend <img> tag."""
    from services.camera_service import generate_frames

    raw_class_id = request.args.get("class_id")
    db_gen = get_db()
    db = next(db_gen)
    try:
        class_id, class_name = _set_active_class(db, raw_class_id)
        if raw_class_id is not None and class_id is None:
            return jsonify({"success": False, "error": "Class not found"}), 404
    finally:
        db_gen.close()

    with recognition_bp.stream_lock:
        recognition_bp.streaming = True  # auto-start if the img tag connects directly
        if class_id is not None:
            recognition_bp.active_class_id = class_id
            recognition_bp.active_class_name = class_name or ""
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


@recognition_bp.route("/state", methods=["GET"])
def get_stream_state():
    """API endpoint to fetch the latest real-time stats and logs."""
    with recognition_bp.stream_lock:
        return jsonify({
            "success": True,
            "class_id": recognition_bp.active_class_id,
            "class_name": recognition_bp.active_class_name,
            "camera_source": str(getattr(recognition_bp, "active_camera_source", CAMERA_SOURCE)),
            "stats": recognition_bp.latest_stats,
            "logs": recognition_bp.latest_logs
        }), 200

@recognition_bp.route("/", methods=["GET"])
def get_classes():
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        classes = db.query(Class).all()
        class_list = [{"class_id": c.class_id, "class_name": c.class_name} for c in classes]
        return jsonify({"classes": class_list}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db_gen.close()

@recognition_bp.route("/<class_id>", methods=["POST"])
def get_feed_from_selected_class(class_id):
    db_gen = get_db()
    db = next(db_gen)

    try:
        class_obj = db.query(Class).filter(Class.class_id == class_id).first()
        if not class_obj:
            return jsonify({"success": False, "error": "Class not found"}), 404

        # Here you can implement logic to fetch and return the feed for the selected class
        # For now, we just return the class details
        return jsonify({
            "success": True,
            "class": {
                "class_id": class_obj.class_id,
                "class_name": class_obj.class_name
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db_gen.close()