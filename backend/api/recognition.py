import threading
import cv2
import time
from flask import Blueprint, request, jsonify, Response
from services.recognition_service import process_frame, decode_image
from database.database import get_db
from vision.camera import load_camera, get_capture, release_camera
from config import CAMERA_SOURCE

recognition_bp = Blueprint("recognition", __name__)

# ---------------------------------------------------------------------------
# Module-level streaming state
# ---------------------------------------------------------------------------

# Attach state attributes directly to the blueprint instance to avoid global variables
recognition_bp.cap = None
recognition_bp.streaming = False
recognition_bp.stream_lock = threading.Lock()
recognition_bp.latest_stats = {"detected": 0, "recognized": 0, "unknown": 0, "fps": 0}
recognition_bp.latest_logs = []


def draw_detections(frame, detections):
    """Draw bounding boxes and labels onto a frame in-place."""
    for det in detections:
        box = det.get("box")
        if not box:
            continue
        x, y, w, h = box
        recognized = det.get("recognized", False)
        color = (16, 185, 129) if recognized else (68, 68, 239)  # green / red (BGR)
        label = det.get("name", det.get("rollno", "Unknown"))
        if not recognized:
            label = "Unknown"

        cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)

        # Label background
        (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 1)
        label_y = y - text_h - 8 if y - text_h - 8 > 0 else y + text_h + 8
        cv2.rectangle(frame, (x, label_y - text_h - 4), (x + text_w + 8, label_y + 4), color, -1)
        cv2.putText(frame, label, (x + 4, label_y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)


def generate_frames():
    """Generator that yields MJPEG frame bytes while streaming is True."""
    db = next(get_db())

    with recognition_bp.stream_lock:
        try:
            recognition_bp.cap = load_camera(CAMERA_SOURCE)
        except ValueError as exc:
            print(f"[VIDEO_FEED] Camera error: {exc}")
            return

    frame_count = 0
    cached_detections = []
    last_time = time.time()
    fps = 0.0

    try:
        while True:
            with recognition_bp.stream_lock:
                if not recognition_bp.streaming:
                    break
                ret, frame = get_capture(recognition_bp.cap)

            if not ret or frame is None:
                print("[VIDEO_FEED] Stream ended or frame read failed.")
                break

            current_time = time.time()
            dt = current_time - last_time
            last_time = current_time
            if dt > 0:
                instant_fps = 1.0 / dt
                fps = instant_fps if fps == 0.0 else (0.9 * fps + 0.1 * instant_fps)

            # Run face recognition on each frame
            result = process_frame(frame.copy(), db, "")
            cached_detections = result.get("detections", [])
            
            new_logs = result.get("logs", [])
            detected_count = len(cached_detections)
            recognized_count = sum(1 for d in cached_detections if d.get("recognized"))
            unknown_count = detected_count - recognized_count

            with recognition_bp.stream_lock:
                if new_logs:
                    recognition_bp.latest_logs = (new_logs + recognition_bp.latest_logs)[:100]
                recognition_bp.latest_stats.update({
                    "detected": detected_count,
                    "recognized": recognized_count,
                    "unknown": unknown_count,
                })

            draw_detections(frame, cached_detections)

            # Always update fps in stats
            with recognition_bp.stream_lock:
                recognition_bp.latest_stats["fps"] = int(fps)

            ok, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 75])
            if not ok:
                continue

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + buffer.tobytes()
                + b"\r\n"
            )

            frame_count += 1
    finally:
        with recognition_bp.stream_lock:
            if recognition_bp.cap is not None:
                release_camera(recognition_bp.cap)
                recognition_bp.cap = None
            recognition_bp.streaming = False
            # Reset state
            recognition_bp.latest_stats = {"detected": 0, "recognized": 0, "unknown": 0, "fps": 0}
            recognition_bp.latest_logs = []


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

    db = next(get_db())
    result = process_frame(img, db, class_name)

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

    with recognition_bp.stream_lock:
        recognition_bp.streaming = True
        recognition_bp.latest_stats = {"detected": 0, "recognized": 0, "unknown": 0, "fps": 0}
        recognition_bp.latest_logs = []
    return jsonify({"status": "started", "source": str(CAMERA_SOURCE)}), 200


@recognition_bp.route("/stream/stop", methods=["GET", "OPTIONS"])
def stream_stop():
    """Signal the backend to stop streaming and release the camera."""
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    with recognition_bp.stream_lock:
        recognition_bp.streaming = False
        recognition_bp.latest_stats = {"detected": 0, "recognized": 0, "unknown": 0, "fps": 0}
        recognition_bp.latest_logs = []
    return jsonify({"status": "stopped"}), 200


@recognition_bp.route("/video_feed", methods=["GET"])
def video_feed():
    """MJPEG streaming endpoint consumed by the frontend <img> tag."""
    with recognition_bp.stream_lock:
        recognition_bp.streaming = True  # auto-start if the img tag connects directly
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
            "stats": recognition_bp.latest_stats,
            "logs": recognition_bp.latest_logs
        }), 200