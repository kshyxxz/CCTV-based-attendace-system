import cv2
import numpy as np

from pathlib import Path
from vision.camera import extract_frame,  load_camera
from vision.mtcnn_detector import detect_faces, extract_face, load_detector
from vision.facenet import load_facenet
from vision.embedding import generate_embedding_for_one, generate_embedding_for_group
from vision.recognition import find_best_match
from config import INTERVAL, THRESHOLD, FACE_CONFIDENCE

def registration_service():

	images_dir = Path("uploads") / "images"
	embeddings_dir = Path("database") / "embeddings"

	detector = load_detector()
	generator = load_facenet()

	saved_embeddings = []

	for image_path in sorted(images_dir.glob("*.jpg")):
		img = cv2.imread(str(image_path))

		if img is None:
			continue

		image_name = image_path.name.split(".")[0]

		resized_img = cv2.resize(img, (0, 0), fx=0.5, fy=0.5)
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
		
		if not faces:
			continue

		largest_face = max(faces, key=lambda face: face["box"][2] * face["box"][3])
		
		cropped_face = extract_face(resized_img, largest_face["box"])

		if cropped_face.size == 0:
			continue

		cv2.imshow(image_name, cropped_face)
		cv2.waitKey(0)
		cv2.destroyAllWindows()

		embedding = generate_embedding_for_one(generator, cropped_face)

		if embedding is None:
			continue

		embedding_path = embeddings_dir / f"{image_name}.npy"
		np.save(str(embedding_path), embedding)
		saved_embeddings.append(
			{
				"image": image_path.name,
				"embedding_path": str(embedding_path),
			}
		)
		print(f"Saved embedding for {image_path.name} at {embedding_path}")

	return saved_embeddings

def recognition_service():

	detector = load_detector()
	generator = load_facenet()

	cap = load_camera(0)

	embeddings_dir = Path("database") / "embeddings"

	embedding_paths = sorted(embeddings_dir.glob("*.npy"))

	loaded_embeddings = [np.load(str(path)) for path in embedding_paths]

	for frame in extract_frame(cap, INTERVAL):

		cropped_faces = []

		matches = []

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

			
			index, similarity = find_best_match(embedding, loaded_embeddings, THRESHOLD)

			if index != -1:   # assuming -1 means "no match"
				student_name = embedding_paths[index].stem
			else:
				student_name = "Unknown"

			matches.append(
				{
					"student": student_name,
					"embedding_index": index,
					"similarity": similarity,
				}
			)

		for match in matches:
			print(match["student"])

while True:
    input_choice = input("Enter 'r' for registration or 'c' for recognition ('e' to exit): ").strip().lower()

    if input_choice == 'r':
        registration_service()
    elif input_choice == 'c':
        recognition_service()
    elif input_choice == 'e':
        print("Exiting...")
        break
    else:
        print("Invalid choice. Please try again.")