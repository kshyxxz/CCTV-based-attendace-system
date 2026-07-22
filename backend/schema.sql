CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL
);

CREATE TABLE student (
    rollno VARCHAR(20) PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    class_id INT NOT NULL,

    CONSTRAINT fk_student_class
        FOREIGN KEY (class_id)
        REFERENCES classes(class_id),

    CONSTRAINT chk_rollno_format
    CHECK (
        rollno ~ '^NCE[0-9]{3}[A-Z]{3}[0-9]{3}$'
    )
);

CREATE TABLE embeddings (
    rollno VARCHAR(20) PRIMARY KEY,

    embedding VECTOR(512) NOT NULL,

    CONSTRAINT fk_embedding_student
        FOREIGN KEY (rollno)
        REFERENCES student(rollno)
        ON DELETE CASCADE
);

CREATE TABLE timetable (
    timetable_id SERIAL PRIMARY KEY,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    CONSTRAINT fk_timetable_class
        FOREIGN KEY (class_id)
        REFERENCES classes(class_id),

    CONSTRAINT fk_timetable_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id),

    CONSTRAINT chk_day
    CHECK (
        day_of_week IN (
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        )
    ),

    CONSTRAINT chk_time
    CHECK (
        start_time < end_time
    )
);

CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    rollno VARCHAR(20) NOT NULL,
    attendance_date DATE NOT NULL,
    subject_id INT NOT NULL,
    status VARCHAR(10) NOT NULL,

    CONSTRAINT fk_attendance_student
        FOREIGN KEY (rollno)
        REFERENCES student(rollno)
        ON DELETE CASCADE,

    CONSTRAINT fk_attendance_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id),

    CONSTRAINT chk_status
    CHECK (
        status IN ('Present', 'Absent')
    ),

    CONSTRAINT unique_attendance
    UNIQUE (
        rollno,
        attendance_date,
        subject_id
    )
);

CREATE INDEX embeddings_hnsw_idx
ON embeddings
USING hnsw (
    embedding vector_cosine_ops
);