import base64
import time
import numpy as np
import cv2
from datetime import datetime

from vision.mtcnn_detector import detect_faces, extract_face, load_detector
from vision.facenet import load_facenet
from vision.embedding import generate_embedding_for_group
from vision.recognition import find_best_match

from database.crud import get_all_embeddings, get_student
from services.attendence_service import attendance_service
from config import THRESHOLD, FACE_CONFIDENCE, LOG_COOLDOWN_SECONDS

detector = load_detector()
generator = load_facenet()

# Global memory cache tracking recent detections: { rollno: timestamp }
RECENT_DETECTIONS = {}


def decode_image(base64_str):
    """
    Decodes incoming base64 payload from Flask route into an OpenCV image.
    """
    try:                                                                        
        payload = base64_str.split(",")[1] if "," in base64_str else base64_str                
        img_bytes = base64.b64decode(payload)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def process_frame(img, db, class_name=""):
    global RECENT_DETECTIONS

    if img is None:
        return {"detections": [], "logs": []}

    current_timestamp = time.time()

    # 1. Fetch embeddings
    loaded_records = get_all_embeddings(db)
    roll_numbers = [item.rollno for item in loaded_records]
    stored_embeddings = [item.embedding for item in loaded_records]

    # 2. Detect & Crop faces
    faces = [f for f in detect_faces(detector, img) if f.get("confidence", 0) >= FACE_CONFIDENCE]
    cropped_faces = [extract_face(img, f["box"]) for f in faces if extract_face(img, f["box"]) is not None]
    valid_boxes = [f["box"] for f in faces]

    if not cropped_faces:
        return {"detections": [], "logs": []}

    # 3. Match faces
    embeddings = generate_embedding_for_group(generator, cropped_faces)
    detections, logs, matched_students = [], [], set()
    current_time_str = datetime.now().strftime("%I:%M:%S %p")

    for idx, embedding in enumerate(embeddings):
        if embedding is None:
            continue

        box = valid_boxes[idx]
        index, similarity = find_best_match(embedding, stored_embeddings, threshold=THRESHOLD)

        if index != -1:
            roll = roll_numbers[index]
            recognized = True

            student = get_student(db, roll)
    
            # 2. Extract string safely so Flask doesn't throw a JSON serialization error
            if student and student.fname:
                full_name = f"{student.fname} {student.lname or ''}".strip()
            else:
                full_name = roll

            # Check cooldown against global dictionary
            last_seen = RECENT_DETECTIONS.get(roll, 0)
            elapsed = current_timestamp - last_seen

            if elapsed > LOG_COOLDOWN_SECONDS:
                RECENT_DETECTIONS[roll] = current_timestamp
                matched_students.add(roll)

                logs.append({
                    "name": full_name,
                    "roll": roll,
                    "time": current_time_str,
                    "status": "Present"
                })
            else:
                print(f"[COOLDOWN ACTIVE] {roll} skipped. {int(elapsed)}s / {LOG_COOLDOWN_SECONDS}s passed.")
        else:
            roll, name, recognized = "Unknown", "Unknown", False

        detections.append({
            "rollno": roll,
            "name": roll,
            "recognized": recognized,
            "similarity": float(similarity) if similarity else 0.0,
            "box": box
        })

    # 4. Save to DB
    if matched_students:
        attendance_service(db, matched_students)

    return {"detections": detections, "logs": logs}