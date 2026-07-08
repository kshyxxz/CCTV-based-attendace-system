import cv2
from keras_facenet import FaceNet

def load_facenet():
	"""
	Load the FaceNet model for face recognition.

	Returns:
		FaceNet: An instance of the FaceNet model.
	"""
	return FaceNet()

def get_embedding(facenet, face):
	"""
	Get the embedding for a given face using the FaceNet model.

	Args:
		facenet (FaceNet): The FaceNet model instance.
		face (np.ndarray): The preprocessed face image.
	"""
	if facenet is None or face is None:
		return None

	embedding = facenet.embeddings([face])[0]
	return embedding
