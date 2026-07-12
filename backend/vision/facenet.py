import cv2
import numpy as np
from keras_facenet import FaceNet

def load_facenet():

	return FaceNet()

def get_embedding(facenet, face):

	if facenet is None or face is None:
		return None

	embedding = facenet.embeddings([face])[0]

	return embedding
