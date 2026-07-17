
-- =====================================================
-- Enable pgvector extension
-- Run once per database
-- =====================================================
CREATE EXTENSION IF NOT EXISTS vector;


-- =====================================================
-- STUDENT TABLE
-- =====================================================
CREATE TABLE student (
    rollno VARCHAR(20) PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    address TEXT,

    -- Example: NCE081BCT021
    CONSTRAINT chk_rollno_format
    CHECK (
        rollno ~ '^NCE[0-9]{3}[A-Z]{3}[0-9]{3}$'
    )
);


-- =====================================================
-- EMBEDDINGS TABLE
-- =====================================================
CREATE TABLE embeddings (
    rollno VARCHAR(20) PRIMARY KEY,

    -- FaceNet embedding (512 dimensions)
    embedding VECTOR(512) NOT NULL,

    CONSTRAINT fk_embedding_student
    FOREIGN KEY (rollno)
    REFERENCES student(rollno)
    ON DELETE CASCADE
);


-- =====================================================
-- ATTENDANCE TABLE
-- =====================================================
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,

    rollno VARCHAR(20) NOT NULL,
    attendance_date DATE NOT NULL,
    day VARCHAR(10) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    status VARCHAR(10) NOT NULL,

    CONSTRAINT fk_attendance_student
    FOREIGN KEY (rollno)
    REFERENCES student(rollno)
    ON DELETE CASCADE,

    CONSTRAINT chk_status
    CHECK (
        status IN ('Present', 'Absent')
    ),

    -- Prevent duplicate attendance records
    CONSTRAINT unique_attendance
    UNIQUE (
        rollno,
        attendance_date,
        subject
    )
);


-- =====================================================
-- INDEX FOR FAST VECTOR SEARCH
-- =====================================================
CREATE INDEX embeddings_hnsw_idx
ON embeddings
USING hnsw (
    embedding vector_cosine_ops
);