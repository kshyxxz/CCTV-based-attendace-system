import cv2
from backend.vision.camera import open_camera
from backend.vision.mtcnn_detector import detect_faces
from backend.vision.preprocessing import preprocess_face
from backend.vision.facenet import get_embedding
from backend.vision.embedding import compare_embeddings

def recognize_from_camera(source="Data/vd01.mp4"):
    cap = open_camera(source)
    frame_count = 0

    while True:
        success, frame = cap.read()
        if not success:
            print("No more frames or cannot open source.")
            break

        frame_count += 1
        faces = detect_faces(frame)

        for face in faces:
            processed = preprocess_face(face)
            embedding = get_embedding(processed)

            print(f"Frame {frame_count} processed, embedding length: {len(embedding)}")
            yield embedding

        if frame_count >= 20:  # stop after 20 frames for testing
            break

    cap.release()
