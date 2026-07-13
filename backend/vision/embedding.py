from config import FACE_SIZE, EMBEDDING_DIMENSION
from vision.facenet import load_facenet, get_embedding
import numpy as np

facenet = load_facenet()

def generate_embedding_for_one(facenet, face):

	embedding = get_embedding(facenet, face)

	return embedding

def generate_embedding_for_group(facenet, face_list):

	if not face_list:
		return []
	
	embeddings = [generate_embedding_for_one(facenet, face) for face in face_list]

	return embeddings