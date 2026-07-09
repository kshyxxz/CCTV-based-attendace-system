import cv2

def resize_face(face, target_size=(160, 160)):
	if face is None:
		return None

	resized_face = cv2.resize(face, target_size)
	return resized_face

def normalize_face(face):
	if face is None:
		return None

	normalized_face = face.astype('float32') / 255.0
	return normalized_face

def preprocess_face(face, target_size=(160, 160)):
	if face is None:
		return None

	resized_face = resize_face(face, target_size)
	normalized_face = normalize_face(resized_face)
	return normalized_face