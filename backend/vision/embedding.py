from backend.config import FACE_SIZE, EMBEDDING_DIMENSION
from preprocessing import preprocess_face
from facenet import load_facenet, get_embedding
import numpy as np

facenet = load_facenet()

def generate_embedding_for_one(face):

	"""
	Returns:
		np.ndarray: The generated embedding as a NumPy array.
	"""

	preprocessed_face = preprocess_face(face)
	embedding = get_embedding(facenet, preprocessed_face)

	return embedding

def generate_embedding_for_group(face_list):

	"""
	Returns:
		np.ndarray: A list of generated embeddings as NumPy arrays.
	"""

	if not face_list:
		return None
	
	preprocessed_faces = [preprocess_face(face) for face in face_list]
	embeddings = [generate_embedding_for_one(preprocessed_face) for preprocessed_face in preprocessed_faces]

	return embeddings