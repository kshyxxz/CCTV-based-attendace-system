import base64
import time
import numpy as np
import cv2
from datetime import datetime

from vision.mtcnn_detector import detect_faces, extract_face, load_detector
from vision.facenet import load_facenet
from vision.embedding import generate_embedding_for_group
from vision.recognition import find_best_match

from database.crud import get_all_embeddings, get_student, get_class_id
from database.models import Student
from services.attendence_service import attendance_service
from config import THRESHOLD, FACE_CONFIDENCE, LOG_COOLDOWN_SECONDS

detector = load_detector()
generator = load_facenet()

# Global memory cache tracking recent detections: { rollno: timestamp }
RECENT_DETECTIONS = {}
EMBEDDING_CACHE = {}  # { class_id: (timestamp, roll_numbers, stored_embeddings) }
STUDENT_CACHE = {}    # { rollno: (timestamp, full_name) }
CACHE_EXPIRY_SECONDS = 10.0


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

def process_frame(img, db, class_id=None, class_name=""):
    global RECENT_DETECTIONS, EMBEDDING_CACHE, STUDENT_CACHE

    if img is None:
        return {"detections": [], "logs": []}

    if class_id is None and class_name:
        class_id = get_class_id(db, class_name)

    current_timestamp = time.time()

    # 1. Fetch embeddings (with memory cache to avoid DB query on every frame)
    cached_data = EMBEDDING_CACHE.get(class_id)
    if cached_data and (current_timestamp - cached_data[0] < CACHE_EXPIRY_SECONDS):
        roll_numbers, stored_embeddings = cached_data[1], cached_data[2]
    else:
        loaded_records = get_all_embeddings(db)
        if class_id is not None:
            class_rolls = {
                student.rollno
                for student in db.query(Student).filter(Student.class_id == class_id).all()
            }
            loaded_records = [record for record in loaded_records if record.rollno in class_rolls]

        roll_numbers = [item.rollno for item in loaded_records]
        stored_embeddings = [item.embedding for item in loaded_records]
        EMBEDDING_CACHE[class_id] = (current_timestamp, roll_numbers, stored_embeddings)

    # 2. Detect & Crop faces
    # Downscale frame for face detection to significantly speed up MTCNN processing
    h, w = img.shape[:2]
    target_width = 480  # Balanced resolution for CPU-based detection
    scale = target_width / w
    if scale < 1.0:
        img_small = cv2.resize(img, (target_width, int(h * scale)))
    else:
        img_small = img
        scale = 1.0

    raw_faces = detect_faces(detector, img_small)
    
    # Scale bounding boxes back up to original frame coordinates
    faces = []
    for f in raw_faces:
        if f.get("confidence", 0) >= FACE_CONFIDENCE:
            bx, by, bw, bh = f["box"]
            scaled_box = [
                int(bx / scale),
                int(by / scale),
                int(bw / scale),
                int(bh / scale)
            ]
            scaled_box[0] = max(0, scaled_box[0])
            scaled_box[1] = max(0, scaled_box[1])
            scaled_box[2] = min(w - scaled_box[0], scaled_box[2])
            scaled_box[3] = min(h - scaled_box[1], scaled_box[3])
            
            faces.append({
                "box": scaled_box,
                "confidence": f["confidence"]
            })

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

            # Use student details cache to avoid DB lookup on every face
            cached_student = STUDENT_CACHE.get(roll)
            if cached_student and (current_timestamp - cached_student[0] < CACHE_EXPIRY_SECONDS):
                full_name = cached_student[1]
            else:
                student = get_student(db, roll)
                if student and student.fname:
                    full_name = f"{student.fname} {student.lname or ''}".strip()
                else:
                    full_name = roll
                STUDENT_CACHE[roll] = (current_timestamp, full_name)

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
            roll, full_name, recognized = "Unknown", "Unknown", False

        detections.append({
            "rollno": roll,
            "name": full_name,
            "recognized": recognized,
            "similarity": float(similarity) if similarity else 0.0,
            "box": box
        })

    # 4. Save to DB
    if matched_students:
        attendance_service(db, matched_students, class_id=class_id)

    return {"detections": detections, "logs": logs}