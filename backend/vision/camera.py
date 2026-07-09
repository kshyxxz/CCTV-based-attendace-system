import cv2

def load_video(video_path):  
	cap = cv2.VideoCapture(video_path)      
	if not cap.isOpened():
		raise ValueError(f"Unable to open video file at {video_path}")
	return cap

def load_camera(camera_index=0):
	cap = cv2.VideoCapture(camera_index)
	if not cap.isOpened():
		raise ValueError(f"Unable to open camera with index {camera_index}")
	return cap

def get_frame(cap):
	ret, frame = cap.read()
	if not ret:
		raise ValueError("Unable to read frame from video capture")
	return frame

def release_camera(cap):
	cap.release()
	return cv2.destroyAllWindows()