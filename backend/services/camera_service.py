import cv2
import time
import threading
from api.recognition import recognition_bp
from services.recognition_service import process_frame
from vision.camera import load_camera, get_capture, release_camera
from database.database import get_db
from config import CAMERA_SOURCE, FRAME_SKIP

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
    db_gen = get_db()
    db = next(db_gen)

    with recognition_bp.stream_lock:
        camera_source = getattr(recognition_bp, "active_camera_source", CAMERA_SOURCE)
        try:
            recognition_bp.cap = load_camera(camera_source)
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
                cap = recognition_bp.cap
                active_class_name = getattr(recognition_bp, "active_class_name", "") or ""
                active_class_id = getattr(recognition_bp, "active_class_id", None)

            if cap is None:
                break

            ret, frame = get_capture(cap)

            if not ret or frame is None:
                time.sleep(0.01)
                continue

            current_time = time.time()
            dt = current_time - last_time
            last_time = current_time
            if dt > 0:
                instant_fps = 1.0 / dt
                fps = instant_fps if fps == 0.0 else (0.9 * fps + 0.1 * instant_fps)

            # Run face recognition only on every N-th frame (using FRAME_SKIP)
            if frame_count % FRAME_SKIP == 0:
                result = process_frame(
                    frame.copy(),
                    db,
                    class_id=active_class_id,
                    class_name=active_class_name,
                )
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
            recognition_bp.active_class_id = None
            recognition_bp.active_class_name = ""
            recognition_bp.active_camera_source = CAMERA_SOURCE
            # Reset state
            recognition_bp.latest_stats = {"detected": 0, "recognized": 0, "unknown": 0, "fps": 0}
            recognition_bp.latest_logs = []
        db_gen.close()

