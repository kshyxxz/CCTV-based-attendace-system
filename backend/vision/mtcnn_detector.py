import cv2
from mtcnn import MTCNN

def load_detector():
	return MTCNN()

def detect_faces(detector, frame):
	if detector is None or frame is None:
		return []

	rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
	faces = detector.detect_faces(rgb_frame)

	return faces	# return list of dictionaries with face details

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

def extract_face(frame, box):
	if frame is None or box is None:
		return None

	x, y, width, height = box
	cropped_face = frame[y:y + height, x:x + width]

	return cropped_face