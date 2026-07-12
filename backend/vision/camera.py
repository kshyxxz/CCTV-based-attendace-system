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

def get_capture(cap):
	return cap.read()

def extract_frame(cap, interval_seconds=1):
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Some webcams return FPS = 0
    if fps <= 0:
        fps = 30

    frame_interval = max(1, int(fps * interval_seconds))
    frame_count = 0

    while True:
        ret, frame = get_capture(cap)
        if not ret:
            break

        # Always display the live camera
        cv2.imshow("Camera", frame)

        # Exit if user presses q
        if stop_camera():
            break

        # Yield only every Nth frame for recognition
        if frame_count % frame_interval == 0:
            yield frame

        frame_count += 1
    release_camera(cap)

def stop_camera(key='q'):
    return cv2.waitKey(1) & 0xFF == ord(key)

def release_camera(cap):
	cap.release()
	return cv2.destroyAllWindows()