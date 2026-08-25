# CCTV-Based Automated Attendance System - Setup Guide

This document outlines the detailed instructions required to set up, configure, and run the CCTV-Based Automated Attendance System locally on your machine.

---

## System Prerequisites

Ensure you have the following software installed on your system before proceeding:

### 1. General Requirements

- **Node.js**: Version 18.x or higher (includes `npm`).
- **Python**: Version 3.10 or 3.11 (recommended for compatibility with TensorFlow, Keras, MTCNN, and OpenCV).
- **PostgreSQL**: Version 12 or higher.
- **Git**: For cloning the repository.

### 2. CCTV / Camera Feed Sources

- A built-in webcam, external USB camera, or
- Access to an IP/CCTV Camera stream via **RTSP** or **HTTP** protocols, or

---

## Step 1: PostgreSQL Database & pgvector Setup

The system relies on PostgreSQL database with the **pgvector** extension to store and perform high-dimensional vector similarity searches on 512-dimension FaceNet embeddings.

### Option A: Installing pgvector on Windows (Manual)

If you are running PostgreSQL natively on Windows:

1. Determine your PostgreSQL version (e.g., PostgreSQL 15, 16).
2. Go to the [pgvector GitHub Releases](https://github.com/pgvector/pgvector/releases) page.
3. Download the zip archive matching your PostgreSQL version and architecture (usually `x64`).
4. Extract the zip file and copy the contents to your PostgreSQL installation directory (typically `C:\Program Files\PostgreSQL\<version>\`):
    - Copy `lib/vector.dll` to the `lib` folder.
    - Copy `share/extension/vector.control` and all SQL files (`vector--*.sql`) to the `share/extension` folder.
5. Restart your PostgreSQL service via Windows Services or run:
    ```cmd
    net stop postgresql-x64-<version>
    net start postgresql-x64-<version>
    ```

### Option B: Running PostgreSQL with pgvector using Docker

If you prefer to avoid manual library setup, you can spin up a Docker container with pgvector pre-installed:

```bash
docker run --name cctv-postgres \
  -e POSTGRES_PASSWORD=nanobanana \
  -e POSTGRES_DB=student_details \
  -p 5432:5432 \
  -d pgvector/pgvector:pg16
```

### Option C: Linux / macOS Installation

- **Ubuntu / Debian**:
    ```bash
    sudo apt-get install postgresql-server-dev-all
    git clone --branch v0.4.2 https://github.com/pgvector/pgvector.git
    cd pgvector
    make
    make install # may need sudo
    ```
- **macOS** (using Homebrew):
    ```bash
    brew install pgvector
    ```

### Database Initialization

1. Create a database named `student_details` using `psql`, pgAdmin, or your preferred database GUI:
    ```sql
    CREATE DATABASE student_details;
    ```
2. Connect to the `student_details` database and execute the `backend/schema.sql` file to create the tables:
    - On command line:
        ```bash
        psql -U postgres -d student_details -f backend/schema.sql
        ```
    - Or open the file `backend/schema.sql` and run its contents in your database query editor. This will enable the `vector` extension and configure the table indices.

---

## Step 2: Environment Variables Configuration

Copy or create a file named `.env` in the **root directory** of the repository:

```env
# Database Credentials
DATABASE_USERNAME="postgres"
DATABASE_PASSWORD="your_postgres_password"
DATABASE_HOST="localhost"
DATABASE_PORT="5432"
DATABASE_NAME="student_details"

# Vision / Camera Configurations (Optional overrides)
CAMERA_SOURCE="0"              # Default camera index (0 for built-in webcam)
CAMERA_WIDTH="640"             # Capture width in pixels
CAMERA_HEIGHT="480"            # Capture height in pixels
CAMERA_FPS="30"                # Targeted Frame Rate

# Recognition Parameters
FRAME_SKIP="5"                 # Skip N frames between detections to optimize performance
INTERVAL="1"                   # Log updates in seconds
THRESHOLD="0.6"                # Cosine similarity threshold (lower = stricter face match)
FACE_CONFIDENCE="0.9"          # Face detector confidence threshold
EMBEDDING_DIMENSION="512"      # Embeddings vector dimension size
LOG_COOLDOWN_SECONDS="15"      # Cooldown before logging attendance again for the same student
```

---

## Step 3: Backend Setup (Flask Application)

1. Open a new terminal session in the **root folder** of the project.
2. Initialize a Python virtual environment:
    ```bash
    python -m venv env
    ```
3. Activate the virtual environment:
    - **Windows (Command Prompt)**:
        ```cmd
        .\env\Scripts\activate
        ```
    - **Windows (PowerShell)**:
        ```powershell
        .\env\Scripts\Activate.ps1
        ```
    - **macOS / Linux**:
        ```bash
        source env/bin/activate
        ```
4. Upgrade pip and install the backend requirements:

    ```bash
    pip install --upgrade pip
    pip install -r backend/requirements.txt
    ```

    > [!NOTE]
    > `requirements.txt` contains library dependencies such as `tensorflow`, `keras-facenet`, `mtcnn`, `opencv-python`, and `SQLAlchemy`. The installation might take a few minutes as these libraries download deep learning weights and libraries.

5. Navigate to the `backend` directory and start the Flask web server:
    ```bash
    cd backend
    python app.py
    ```
    The backend service should boot and run on `http://127.0.0.1:5000`.

---

## Step 4: Frontend Setup (React + Vite)

1. Open a **second terminal session** in the **root folder** of the project.
2. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
3. Install package dependencies:
    ```bash
    npm install
    ```
4. Launch the local development server:
    ```bash
    npm run dev
    ```
    Once complete, the development environment will display a URL, typically `http://localhost:5173`. Open this URL in your web browser.

---

## Step 5: Verify Setup & Run

1. Open the web interface at `http://localhost:5173`.
2. Navigate to **Classes** and create a new class section (e.g. `A-101`) and configure its camera source. Use `0` for your local webcam, a local video file path (relative or absolute), or an RTSP stream URL.
3. Go to **Students** and register a new student. Fill out their name, roll number, class association, and upload a clear portrait image of their face.
    > [!IMPORTANT]
    > When you upload a student's photo, the backend uses MTCNN and FaceNet to extract and register their facial embeddings. The very first face enrollment will trigger the download of pre-trained models (FaceNet and MTCNN weights) which may take several seconds.
4. Navigate to the **Timetable** section and add class sessions for today's date and time.
5. Click **Live Stream / Recognition**. The system will open the configured camera source, run live face recognition, look up matching embeddings in the PostgreSQL database, and dynamically log attendance records.

---

## Troubleshooting Guide

### `pgvector` / `vector` Type Errors

- **Error**: `type "vector" does not exist` or `extension "vector" does not exist`.
- **Fix**: Ensure that the `vector.dll` and SQL control files were copied to the correct directories matching your installed PostgreSQL version. Ensure that you have restarted the PostgreSQL database service. Run `CREATE EXTENSION IF NOT EXISTS vector;` manually in your database.

### OpenCV / Camera Initialization Failures

- **Error**: `Unable to open camera source: 0` or `Stream ended or connection lost`.
- **Fix**:
    - Verify that the camera is plugged in and not currently in use by another application (Zoom, Teams, etc.).
    - Try changing the `CAMERA_SOURCE` in the class configurations or `.env` to `1` or `2` if you have multiple video input devices.
    - If using an RTSP camera stream, ensure you can ping the camera IP and credentials are correct.

### TensorFlow / C++ Build Tools Issues

- **Error**: Errors compiling C++ libraries or `pip install` errors.
- **Fix**: Some packages compiled from source on Windows require the **Microsoft Visual C++ Redistributable** and **Build Tools for Visual Studio**. Install the build tools package from [visualstudio.microsoft.com/visual-cpp-build-tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) if prompted.
