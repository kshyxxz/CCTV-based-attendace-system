import cv2

from pathlib import Path
from vision.mtcnn_detector import detect_faces, extract_face, load_detector
from vision.facenet import load_facenet
from vision.embedding import generate_embedding_for_one
from database.crud import save_embeddings
from database.database import get_db

def registration_service(db, photo, image_name):

	detector = load_detector()
	generator = load_facenet()

	if photo is None:
		raise ValueError("Invalid image")

	resized_img = cv2.resize(photo, (0, 0), fx=0.5, fy=0.5)
	
	faces = detect_faces(detector, resized_img)

	"""
	[
		{
			'box': [100, 60, 90, 110],  # [x_coordinate, y_coordinate, box_width, box_height]
			'confidence': 0.9998,
			'keypoints': {
				'left_eye': (135, 95),
				'right_eye': (165, 96),
				'nose': (152, 115),
				'mouth_left': (139, 135),
				'mouth_right': (163, 136)
			}
		},
		{
			'box': [330, 90, 95, 115],
			'confidence': 0.9992,
			'keypoints': {
				'left_eye': (365, 130),
				'right_eye': (395, 128),
				'nose': (382, 150),
				'mouth_left': (368, 172),
				'mouth_right': (392, 170)
			}
		},
		{
			'box': [510, 105, 85, 105],
			'confidence': 0.9845,
			'keypoints': {
				'left_eye': (540, 140),
				'right_eye': (568, 141),
				'nose': (553, 158),
				'mouth_left': (542, 178),
				'mouth_right': (565, 179)
			}
		}
	]
	"""

	largest_face = max(faces, key=lambda face: face["box"][2] * face["box"][3])
	
	cropped_face = extract_face(resized_img, largest_face["box"])

	embedding = generate_embedding_for_one(generator, cropped_face)

	save_embeddings(db, image_name, embedding)

	print(f"Saved embedding for {image_name}")

	return embedding
