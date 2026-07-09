# backend/services/recognition_service.py

import numpy as np
from backend.vision.recognition import recognize_frame
from backend.database.models import Embedding, Student
from backend.database.database import SessionLocal


def cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two vectors."""
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)

    if norm_vec1 == 0 or norm_vec2 == 0:
        return 0.0

    return dot_product / (norm_vec1 * norm_vec2)


def find_student(embedding, threshold=0.8):
    """
    Compare embedding with stored embeddings using cosine similarity.
    Returns (Student, similarity) if match found, else (None, None).
    """
    db = SessionLocal()
    try:
        stored_embeddings = db.query(Embedding).all()
        best_similarity = -1.0
        matched_rollno = None

        for emb in stored_embeddings:
            sim = cosine_similarity(embedding, emb.embedding)
            if sim > best_similarity and sim >= threshold:
                best_similarity = sim
                matched_rollno = emb.rollno

        if matched_rollno:
            student = db.query(Student).filter_by(rollno=matched_rollno).first()
            return student, best_similarity

        return None, None
    finally:
        db.close()


def recognize_attendance(frame, threshold=0.8):
    """
    Recognize student from a CCTV frame.
    Returns (Student, similarity) if recognized, else (None, None).
    """
    embeddings = recognize_frame(frame, [])
    if not embeddings:
        return None, None

    embedding, _ = embeddings[0]
    return find_student(embedding, threshold)


if __name__ == "__main__":
    print("Recognition service ready. Import and call recognize_attendance(frame) in your API.")
