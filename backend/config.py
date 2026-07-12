from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
DATABASE_HOST = os.getenv('DATABASE_HOST')
DATABASE_PORT = os.getenv('DATABASE_PORT')
DATABASE_NAME = os.getenv('DATABASE_NAME')

DATABASE_URL = f"postgresql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"

CAMERA_SOURCE = int(os.getenv("CAMERA_SOURCE", 0))
CAMERA_WIDTH = int(os.getenv("CAMERA_WIDTH", 640))
CAMERA_HEIGHT = int(os.getenv("CAMERA_HEIGHT", 480))
CAMERA_FPS = int(os.getenv("CAMERA_FPS", 30))

FACE_SIZE = (160, 160)
FRAME_SKIP = int(os.getenv("FRAME_SKIP", 5))

INTERVAL = int(os.getenv("INTERVAL", 10))	# in seconds

THRESHOLD = float(os.getenv("THRESHOLD", 0.6))
FACE_CONFIDENCE = float(os.getenv("FACE_CONFIDENCE", 0.9))

# MAX_EMBEDDINGS = int(os.getenv("MAX_EMBEDDINGS", 100))

EMBEDDING_DIMENSION = int(os.getenv("EMBEDDING_DIMENSION", 512))

# BLUR_THRESHOLD = float(os.getenv("BLUR_THRESHOLD", 100.0))
# DARK_THRESHOLD = float(os.getenv("DARK_THRESHOLD", 40.0))
# BRIGHT_THRESHOLD = float(os.getenv("BRIGHT_THRESHOLD", 220.0))