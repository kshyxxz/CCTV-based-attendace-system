import threading
import time
import cv2
from config import CAMERA_FPS

class ThreadedCamera:
    """
    Dedicated threaded camera reader that continuously captures the newest frame
    in a background thread, preventing OpenCV frame buffer backlog and video lag,
    while throttling reads to match the camera's configured FPS.
    """
    def __init__(self, camera_source, target_fps=None):
        if isinstance(camera_source, str) and camera_source.isdigit():
            camera_source = int(camera_source)

        self.cap = cv2.VideoCapture(camera_source)
        if not self.cap.isOpened():
            raise ValueError(f"Unable to open camera source: {camera_source}")

        # Determine target FPS: use passed target_fps, or hardware reported FPS, or CAMERA_FPS from config
        hw_fps = self.cap.get(cv2.CAP_PROP_FPS)
        if target_fps:
            self.target_fps = target_fps
        elif hw_fps and 5 <= hw_fps <= 120:
            self.target_fps = hw_fps
        else:
            self.target_fps = CAMERA_FPS or 25

        # Attempt to set frame rate on camera hardware
        try:
            self.cap.set(cv2.CAP_PROP_FPS, self.target_fps)
        except Exception:
            pass

        # Limit OpenCV internal buffer size
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

        self.min_interval = 1.0 / self.target_fps if self.target_fps > 0 else 1.0 / 25.0
        self.last_yield_time = 0.0

        self.ret = False
        self.frame = None
        self.running = True
        self.lock = threading.Lock()
        self.new_frame_event = threading.Event()

        # Read the first frame synchronously to confirm connection
        self.ret, self.frame = self.cap.read()
        if self.ret:
            self.new_frame_event.set()

        self.thread = threading.Thread(target=self._update, daemon=True)
        self.thread.start()

    def _update(self):
        while self.running:
            if self.cap.isOpened():
                ret, frame = self.cap.read()
                if ret:
                    with self.lock:
                        self.ret = ret
                        self.frame = frame
                        self.new_frame_event.set()
                else:
                    time.sleep(0.01)
            else:
                time.sleep(0.01)

    def read(self, wait_for_new=True):
        if wait_for_new:
            # Block until a fresh frame arrives from the hardware
            self.new_frame_event.wait(timeout=0.5)
            self.new_frame_event.clear()

        # Rate limit to ensure we match the camera's true FPS (e.g. 25 FPS)
        now = time.time()
        elapsed = now - self.last_yield_time
        if elapsed < self.min_interval:
            time.sleep(self.min_interval - elapsed)
        self.last_yield_time = time.time()

        with self.lock:
            if self.frame is not None:
                return self.ret, self.frame.copy()
            return self.ret, None

    def isOpened(self):
        return self.cap is not None and self.cap.isOpened()

    def release(self):
        self.running = False
        self.new_frame_event.set()
        if self.thread.is_alive():
            self.thread.join(timeout=1.0)
        if self.cap is not None:
            self.cap.release()


def load_video(video_path):  
    cap = cv2.VideoCapture(video_path)      
    if not cap.isOpened():
        raise ValueError(f"Unable to open video file at {video_path}")
    return cap


def load_camera(camera_source: int | str = 0, threaded: bool = True):
    """
    Accepts:
    - Integer (e.g., 0, 1) for local webcams
    - String (e.g., "rtsp://...", "http://...") for CCTV / IP Cameras
    - String path (e.g., "videos/sample.mp4") for video files
    """
    if threaded:
        return ThreadedCamera(camera_source)

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