import cv2

def load_video(video_path):  
    cap = cv2.VideoCapture(video_path)      
    if not cap.isOpened():
        raise ValueError(f"Unable to open video file at {video_path}")
    return cap


def load_camera(camera_source: int | str = 0):
    """
    Accepts:
    - Integer (e.g., 0, 1) for local webcams
    - String (e.g., "rtsp://...", "http://...") for CCTV / IP Cameras
    - String path (e.g., "videos/sample.mp4") for video files
    """
    # Convert numeric string like "0" to int 0 for local webcam index
    if isinstance(camera_source, str) and camera_source.isdigit():
        camera_source = int(camera_source)

    cap = cv2.VideoCapture(camera_source)
    if not cap.isOpened():
        raise ValueError(f"Unable to open camera source: {camera_source}")
    return cap


def switch_camera(current_cap, new_source):
    """
    Safely releases an existing capture object and loads a new camera source.
    Returns the new VideoCapture object without using any global variables.
    """
    if current_cap is not None:
        release_camera(current_cap)
    
    print(f"[CAMERA SERVICE] Loading new camera source: {new_source}")
    return load_camera(new_source)


def get_capture(cap):
    if cap is None or not cap.isOpened():
        return False, None
    return cap.read()


def extract_frame(cap, interval_seconds=1):
    if cap is None or not cap.isOpened():
        raise ValueError("Provided camera capture instance is invalid or closed.")

    fps = cap.get(cv2.CAP_PROP_FPS)

    # Webcams or RTSP streams often report FPS <= 0 or erroneous high numbers
    if fps <= 0 or fps > 120:
        fps = 30

    frame_interval = max(1, int(fps * interval_seconds))
    frame_count = 0

    while True:
        ret, frame = get_capture(cap)
        if not ret:
            print("[CAMERA] Stream ended or connection lost.")
            break

        if frame is None:
            continue

        # Yield frame for face recognition at the specified interval
        if frame_count % frame_interval == 0:
            yield frame

        display_frame = cv2.resize(frame, (640, 480))
        cv2.imshow("Camera", display_frame)

        # Exit if user presses 'q'
        if stop_camera():
            break

        frame_count += 1

    release_camera(cap)


def stop_camera(key='q'):
    return cv2.waitKey(1) & 0xFF == ord(key)


def release_camera(cap):
    if cap is not None:
        cap.release()
    cv2.destroyAllWindows()