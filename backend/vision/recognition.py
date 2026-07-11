import numpy as np
from vision.preprocessing import preprocess_face
from vision.facenet import load_facenet, get_embedding

def cosine_similarity(vec1, vec2):

	"""
	Returns:
		float: Cosine similarity between vec1 and vec2.
	"""

	dot_product = np.dot(vec1, vec2)
	norm_vec1 = np.linalg.norm(vec1)
	norm_vec2 = np.linalg.norm(vec2)
	
	if norm_vec1 == 0 or norm_vec2 == 0:
		return 0.0
	
	return dot_product / (norm_vec1 * norm_vec2)

def find_best_match(embedding, known_embeddings, threshold=0.8):
    best_index = -1
    best_similarity = -1.0

    for i, known_embedding in enumerate(known_embeddings):
        similarity = cosine_similarity(embedding, known_embedding)

        if similarity > best_similarity:
            best_similarity = similarity
            best_index = i

    if best_similarity >= threshold:
        return best_index, best_similarity

    return -1, best_similarity	

def recognize_frame(frame, known_embeddings):

	"""
	Returns:
		list: A list of recognized faces and their corresponding similarity scores.
	"""

	if frame is None or known_embeddings is None:
		return []

	preprocessed_frame = preprocess_face(frame)
	if preprocessed_frame is None:
		return []

	facenet = load_facenet()
	frame_embedding = get_embedding(facenet, preprocessed_frame)

	if frame_embedding is None:
		return []

	best_match, best_similarity = find_best_match(frame_embedding, known_embeddings)

	if best_match is not None:
		return [(best_match, best_similarity)]
	else:
		return []