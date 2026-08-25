# CCTV-Based Automated Attendance System - Operational Workflow

This document explains the technical and operational workflows of the CCTV-Based Automated Attendance System. It details how the frontend, backend, computer vision pipeline, and PostgreSQL database interact to register students and automate class attendance.

---

## High-Level Architecture Workflow

The system is split into three primary components:

1. **Frontend (React + Vite)**: Administration UI for managing classes, students, timetables, and viewing live recognition streams.
2. **Backend (Flask)**: REST APIs and orchestration logic connecting the vision pipeline to the database.
3. **Database (PostgreSQL + pgvector)**: Stores tabular metadata and high-dimensional face embeddings.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Institution Administrator
    participant FE as React Frontend
    participant BE as Flask Backend
    participant CV as OpenCV / MTCNN / FaceNet
    participant DB as PostgreSQL + pgvector

    %% Phase 1: Registration
    rect rgb(240, 248, 255)
        note right of Admin: Phase 1: Student Face Registration
        Admin->>FE: Register student + upload face image
        FE->>BE: POST /students/create (Multipart Form Data)
        BE->>CV: Detect face (MTCNN) & compute 512-D embedding (FaceNet)
        CV-->>BE: Returns 512 float values array
        BE->>DB: Insert student details & face embedding vector
        DB-->>BE: Success
        BE-->>FE: HTTP 201 Created (Success UI Alert)
    end

    %% Phase 2: Live Attendance Tracking
    rect rgb(245, 255, 250)
        note right of Admin: Phase 2: Live Stream Recognition & Attendance Logging
        Admin->>FE: Start attendance stream for a Class Section (e.g. A-101)
        FE->>BE: POST /recognition (with Class ID)
        BE->>DB: Query current class camera source & ongoing subject timetable
        DB-->>BE: Returns camera path (webcam/RTSP) & current subject_id
        BE->>CV: Open camera feed stream & start reading frames
        loop Every Interval / Frame Skip
            CV->>CV: Capture frame -> Detect faces (MTCNN) -> Extract cropped faces
            CV->>CV: Compute FaceNet embeddings for detected faces
            BE->>DB: Query vector similarity (Cosine Distance) against embeddings table
            DB-->>BE: Match found (e.g. Roll No: NCE081BCT021, Similarity: 0.94)
            alt Similarity >= Threshold (e.g., 0.60)
                BE->>DB: UPSERT Attendance table status to 'Present' for student + subject + date
                DB-->>BE: Success
                BE-->>FE: Stream logs & updated analytics via Server-Sent Events / HTTP response
            else Similarity < Threshold
                BE-->>FE: Stream log "Unknown face detected"
            end
        end
    end
```

---

## 1. Student Enrollment Workflow (Phase 1)

When adding a student to the system, the facial biometric profile must be generated and stored:

1. **Information Input**: The admin enters academic details (Roll Number, First Name, Last Name, Phone, Address, Class Section) and uploads a clear face portrait photograph.
2. **Face Detection (MTCNN)**:
    - The Flask backend receives the upload.
    - The **MTCNN (Multi-task Cascaded Convolutional Networks)** detector parses the image, locates bounding boxes of faces, and crops the region of interest.
    - If no face is detected or if multiple faces are detected, the backend returns an error.
3. **Feature Extraction (FaceNet)**:
    - The cropped face image is resized to `160x160` pixels and passed through the **FaceNet** deep neural network.
    - FaceNet converts the visual features of the face into a 512-dimension numerical array (floating-point vector) representing coordinates in a face-feature space.
4. **Vector Storage**:
    - The student’s text details are written to the `student` table.
    - The 512-D vector array is inserted into the `embeddings` table (using PostgreSQL's `pgvector` data type) linked to the student's primary key (`rollno`).

---

## 2. Active Session Resolution (Phase 2)

Before starting a camera recognition process, the system must resolve _what_ class and _which_ subject attendance is being recorded for:

1. The admin triggers the recognition page for a selected class (e.g., `A-101`).
2. The backend looks up the class in the database to retrieve its configured `camera_source` (e.g., IP RTSP link `rtsp://...` or physical index `0`).
3. The system queries the `timetable` table using the **current system time** and **current day of the week**:
   $$\text{Current Time} \in [\text{start\_time}, \text{end\_time}] \quad \land \quad \text{day\_of\_week} = \text{Current Day}$$
4. If a matching subject period is found:
    - Attendance logging is initialized for that specific `subject_id`.
    - If no class session is scheduled on the timetable for this hour, the backend records attendance under a default setup or prevents recognition startup, instructing the user to add a timetable slot.

---

## 3. Live Video Face Recognition & Attendance Loop (Phase 3)

Once the camera source is resolved and the stream starts, the core processing loop runs on the backend:

```mermaid
flowchart TD
    Start([Start Video Stream]) --> GetFrame[Capture Frame via OpenCV]
    GetFrame --> SkipCheck{Should Skip Frame?}
    SkipCheck -- Yes --> GetFrame
    SkipCheck -- No --> DetectFace[MTCNN: Detect Face Boxes]

    DetectFace --> FoundFace{Face Found?}
    FoundFace -- No --> GetFrame

    FoundFace -- Yes --> Extract[Crop and Resize to 160x160]
    Extract --> Embed[FaceNet: Generate 512-D Embedding Vector]

    Embed --> DBQuery[PostgreSQL: Cosine Similarity Query using HNSW Index]
    DBQuery --> MatchCheck{Similarity >= Threshold?}

    MatchCheck -- No --> LogUnknown[Log 'Unknown Face' on Dashboard]
    LogUnknown --> CoolDown[Wait for next frame interval]

    MatchCheck -- Yes --> CoolDownCheck{Log Cooldown Active?}
    CoolDownCheck -- Yes --> CoolDown

    CoolDownCheck -- No --> DBWrite[Insert/Update Attendance table as 'Present']
    DBWrite --> PushFE[Broadcast Detection to Frontend UI]
    PushFE --> CoolDown

    CoolDown --> GetFrame
```

### Detailed Recognition Steps:

1. **Frame Capture**: OpenCV (`cv2.VideoCapture`) connects to the stream and grabs frames continuously.
2. **Frame Skipping (`FRAME_SKIP`)**: To avoid overloading the processor, the system only processes 1 out of every $N$ frames (configured via `FRAME_SKIP` in `.env`). Other frames are discarded.
3. **Embedding Comparison**:
    - The computed vector from the live stream frame is matched against the database using a **Cosine Similarity** query:
      $$\text{Similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}$$
    - This query is accelerated using the PostgreSQL **HNSW (Hierarchical Navigable Small World)** index configured in `schema.sql` on the embeddings table:
        ```sql
        USING hnsw (embedding vector_cosine_ops)
        ```
4. **Attendance Marking**:
    - The student with the closest embedding matching or exceeding the configured `THRESHOLD` (usually `0.60`) is identified.
    - An entry is inserted/updated in the `attendance` table for `(rollno, subject_id, current_date)` with the status set to `'Present'`.
    - **Duplicate prevention**: A database constraint (`unique_attendance`) prevents duplicate rows for the same student, subject, and date.
5. **Cooldown Mechanism**:
    - Once a student is marked present, a local backend timer (`LOG_COOLDOWN_SECONDS`) prevents re-querying the database and flooding the UI with successive recognition events for that same student.
6. **Real-time Reporting**:
    - The backend sends a socket update/SSE chunk to the frontend containing:
        - The detected bounding box coordinates `[x, y, w, h]` (to render face indicators).
        - The student’s name and roll number.
        - Live statistics (Number of faces detected, recognized count, FPS).
