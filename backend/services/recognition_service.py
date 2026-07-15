from vision.camera import extract_frame, load_video, load_camera
from vision.mtcnn_detector import detect_faces, extract_face, load_detector
from vision.facenet import load_facenet
from vision.embedding import generate_embedding_for_group
from vision.recognition import find_best_match
from database.crud import get_all_embeddings
from database.database import get_db
from services.attendence_service import attendance_service
from config import INTERVAL, THRESHOLD, FACE_CONFIDENCE

def recognition_service(class_name):

    detector = load_detector()
    generator = load_facenet()

    db = next(get_db())
    
    cap = load_video(f"uploads/{class_name}.mp4")
    # cap = load_video("uploads/cctv_demo.mp4")
    # cap = load_camera(0)

    #TODO: load embedding of that class only
    loaded_embeddings = get_all_embeddings(db, class_name)

    roll_numbers = [item.rollno for item in loaded_embeddings]
    stored_embeddings = [item.embedding for item in loaded_embeddings]

    for frame in extract_frame(cap, INTERVAL):

        cropped_faces = []

        matches = []
        matched_students = set()   

        faces = detect_faces(detector, frame)

        for face in faces:
            if face["confidence"] < FACE_CONFIDENCE:
                continue

            cropped_face = extract_face(frame, face["box"])
            cropped_faces.append(cropped_face)

        if not cropped_faces:
            continue

        embeddings = generate_embedding_for_group(generator, cropped_faces)

        for embedding in embeddings:

            if embedding is None:
                continue

            index, similarity = find_best_match(
                embedding,
                stored_embeddings,
                THRESHOLD
            )

            if index != -1:
                student_roll_no = roll_numbers[index]

                # Prevent duplicate recognition in the same frame
                if student_roll_no in matched_students:
                    continue

                matched_students.add(student_roll_no)

            else:
                student_roll_no = "Unknown"

            matches.append({
                "student": student_roll_no,
                "embedding_index": index,
                "similarity": similarity,
            })

        for match in matches:
            print(match["student"])
            
        attendance_service(db, matched_students)