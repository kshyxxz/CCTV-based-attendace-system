import cv2

def open_camera(source="Data/vd01.mp4"):
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        raise Exception(f"Cannot open source: {source}")
    return cap
