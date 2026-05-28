-- ============================================================
-- COLLEGE EVENT REGISTRATION SYSTEM
-- Database Schema - schema.sql
-- Covers: Syllabus Modules I, II, VIII, X
-- ============================================================

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS staff;

-- ============================================================
-- TABLE 1: STAFF (organizers)
-- Module II: CREATE TABLE with PRIMARY KEY, UNIQUE
-- ============================================================
CREATE TABLE staff (
    staff_id    INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    role        VARCHAR(50)  DEFAULT 'Organizer',
    department  VARCHAR(50)
);

-- ============================================================
-- TABLE 2: STUDENTS
-- Module I & II: DDL, PRIMARY KEY, UNIQUE, CHECK, TIMESTAMP
-- ============================================================
CREATE TABLE students (
    student_id   INT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(100) UNIQUE NOT NULL,
    contact_no   VARCHAR(15),
    department   VARCHAR(50)  NOT NULL,
    year         INT          CHECK (year >= 1 AND year <= 4),
    gender       ENUM('Male','Female','Other'),
    password_hash VARCHAR(255),
    created_date TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 3: EVENTS
-- Module II: CHECK, ENUM, FOREIGN KEY, DEFAULT
-- ============================================================
CREATE TABLE events (
    event_id        INT PRIMARY KEY AUTO_INCREMENT,
    event_name      VARCHAR(100) NOT NULL UNIQUE,
    event_type      ENUM('Hackathon','CodeContest','Workshop','Gaming','Quiz','Presentation') NOT NULL,
    venue           VARCHAR(100) NOT NULL,
    event_date      DATE NOT NULL,
    start_time      TIME,
    end_time        TIME,
    max_participants INT  CHECK (max_participants > 0),
    min_team_size   INT  DEFAULT 1,
    max_team_size   INT  DEFAULT 5,
    description     TEXT,
    organizer_id    INT,
    event_status    ENUM('Upcoming','Ongoing','Completed','Cancelled') DEFAULT 'Upcoming',
    created_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES staff(staff_id)
);

-- ============================================================
-- TABLE 4: TEAMS
-- Module VIII: One-to-Many, FOREIGN KEY, UNIQUE composite key
-- ============================================================
CREATE TABLE teams (
    team_id        INT PRIMARY KEY AUTO_INCREMENT,
    team_name      VARCHAR(100) NOT NULL,
    event_id       INT NOT NULL,
    leader_id      INT NOT NULL,
    formation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    team_size      INT  DEFAULT 1 CHECK (team_size >= 1 AND team_size <= 10),
    status         ENUM('Active','Inactive','Disbanded') DEFAULT 'Active',
    FOREIGN KEY (event_id)  REFERENCES events(event_id)   ON DELETE CASCADE,
    FOREIGN KEY (leader_id) REFERENCES students(student_id) ON DELETE RESTRICT,
    UNIQUE KEY unique_team_event (team_name, event_id)
);

-- ============================================================
-- TABLE 5: TEAM MEMBERS (Junction table - Many-to-Many)
-- Module VIII: Many-to-Many relationship, composite UNIQUE
-- ============================================================
CREATE TABLE team_members (
    member_id  INT PRIMARY KEY AUTO_INCREMENT,
    team_id    INT NOT NULL,
    student_id INT NOT NULL,
    join_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role       ENUM('Leader','Member') DEFAULT 'Member',
    FOREIGN KEY (team_id)    REFERENCES teams(team_id)     ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE RESTRICT,
    UNIQUE KEY unique_team_student (team_id, student_id)
);

-- ============================================================
-- TABLE 6: REGISTRATIONS
-- Module IV & IX: FOREIGN KEY, UNIQUE, ENUM for status tracking
-- ============================================================
CREATE TABLE registrations (
    reg_id              INT PRIMARY KEY AUTO_INCREMENT,
    student_id          INT NOT NULL,
    event_id            INT NOT NULL,
    team_id             INT,
    registration_type   ENUM('Individual','Team') NOT NULL,
    registration_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status              ENUM('Registered','Confirmed','Cancelled','Completed') DEFAULT 'Registered',
    attendance_status   ENUM('Present','Absent','Pending') DEFAULT 'Pending',
    payment_status      ENUM('Paid','Unpaid','NA') DEFAULT 'NA',
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id)   REFERENCES events(event_id),
    FOREIGN KEY (team_id)    REFERENCES teams(team_id),
    UNIQUE KEY unique_registration (student_id, event_id)
);

-- ============================================================
-- TABLE 7: RESULTS
-- Module V & VII: Generated column, CHECK, FOREIGN KEY
-- ============================================================
CREATE TABLE results (
    result_id       INT PRIMARY KEY AUTO_INCREMENT,
    team_id         INT,
    student_id      INT,
    event_id        INT NOT NULL,
    score           INT  DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    rank_position   INT,
    completion_time INT  COMMENT 'In minutes',
    penalty_points  INT  DEFAULT 0 CHECK (penalty_points >= 0),
    final_score     INT  GENERATED ALWAYS AS (score - penalty_points) STORED,
    submitted_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id)    REFERENCES teams(team_id)       ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
    FOREIGN KEY (event_id)   REFERENCES events(event_id)     ON DELETE CASCADE
);

-- ============================================================
-- TABLE 8: CERTIFICATES
-- Module VI & VII: UNIQUE, ENUM, certificate logic
-- ============================================================
CREATE TABLE certificates (
    cert_id            INT PRIMARY KEY AUTO_INCREMENT,
    student_id         INT NOT NULL,
    event_id           INT NOT NULL,
    team_id            INT,
    certificate_type   ENUM('Winner','Participation','None') NOT NULL,
    score_obtained     INT,
    rank_achieved      INT,
    issued_date        DATE,
    certificate_number VARCHAR(50) UNIQUE,
    status             ENUM('Generated','Printed','Distributed') DEFAULT 'Generated',
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id)   REFERENCES events(event_id),
    FOREIGN KEY (team_id)    REFERENCES teams(team_id)
);

-- ============================================================
-- VIEWS (Module X)
-- ============================================================

-- View 1: Event participation summary
CREATE VIEW event_participation_summary AS
SELECT
    e.event_id,
    e.event_name,
    e.event_type,
    e.event_date,
    e.event_status,
    COUNT(DISTINCT r.student_id) AS total_participants,
    COUNT(DISTINCT t.team_id)    AS total_teams,
    ROUND(AVG(t.team_size), 2)  AS avg_team_size,
    COUNT(r.reg_id)              AS total_registrations
FROM events e
LEFT JOIN registrations r ON e.event_id = r.event_id
LEFT JOIN teams t         ON e.event_id = t.event_id
GROUP BY e.event_id, e.event_name, e.event_type, e.event_date, e.event_status;

-- View 2: Student performance overview
CREATE VIEW student_performance_overview AS
SELECT
    s.student_id,
    s.name,
    s.department,
    s.year,
    COUNT(DISTINCT r.event_id)  AS events_participated,
    COALESCE(SUM(res.final_score), 0)  AS total_score,
    COALESCE(AVG(res.final_score), 0)  AS avg_score,
    COUNT(c.cert_id)            AS certificates_earned
FROM students s
LEFT JOIN registrations r ON s.student_id = r.student_id AND r.status IN ('Confirmed','Completed')
LEFT JOIN results res      ON s.student_id = res.student_id
LEFT JOIN certificates c   ON s.student_id = c.student_id AND c.certificate_type != 'None'
GROUP BY s.student_id, s.name, s.department, s.year;

-- View 3: Department analytics
CREATE VIEW department_analytics AS
SELECT
    s.department,
    COUNT(DISTINCT s.student_id)  AS total_students,
    COUNT(DISTINCT r.event_id)    AS events_participated,
    COALESCE(SUM(res.final_score), 0)   AS total_score,
    COALESCE(ROUND(AVG(res.final_score), 2), 0) AS avg_score,
    COALESCE(MAX(res.final_score), 0)   AS highest_score
FROM students s
LEFT JOIN registrations r ON s.student_id = r.student_id AND r.status = 'Completed'
LEFT JOIN results res      ON s.student_id = res.student_id
GROUP BY s.department;

-- View 4: Leaderboard (team-based)
CREATE VIEW team_leaderboard AS
SELECT
    t.team_id,
    t.team_name,
    e.event_name,
    SUM(res.final_score)  AS total_score,
    COUNT(*)              AS member_results,
    AVG(res.final_score)  AS avg_score,
    MIN(res.rank_position) AS best_rank
FROM results res
JOIN teams t  ON res.team_id = t.team_id
JOIN events e ON res.event_id = e.event_id
GROUP BY t.team_id, t.team_name, e.event_name
ORDER BY total_score DESC;

-- ============================================================
-- INDEXES (Module X)
-- ============================================================
CREATE INDEX idx_student_department ON students(department);
CREATE INDEX idx_student_year       ON students(year);
CREATE INDEX idx_event_date         ON events(event_date);
CREATE INDEX idx_event_status       ON events(event_status);
CREATE INDEX idx_registration_status ON registrations(status);
CREATE INDEX idx_registration_event  ON registrations(event_id);
CREATE INDEX idx_results_score       ON results(score);
CREATE INDEX idx_results_event       ON results(event_id);
CREATE INDEX idx_certificate_type    ON certificates(certificate_type);
CREATE INDEX idx_team_event          ON teams(event_id);

-- Query acceleration for common operations
CREATE INDEX idx_student_event_registration 
ON registrations(student_id, event_id, status);

CREATE INDEX idx_event_team_result 
ON results(event_id, team_id, final_score DESC);

CREATE INDEX idx_student_department_year 
ON students(department, year);

-- ============================================================
-- View 5: Department Rankings
-- ============================================================
CREATE VIEW department_rankings AS
SELECT 
    s.department,
    COUNT(DISTINCT s.student_id) as total_students,
    COUNT(DISTINCT c.cert_id) as certificates_earned,
    SUM(CASE WHEN c.certificate_type = 'Winner' THEN 1 ELSE 0 END) as winning_count,
    ROUND(AVG(res.final_score), 2) as avg_score,
    RANK() OVER (ORDER BY SUM(CASE WHEN c.certificate_type = 'Winner' THEN 1 ELSE 0 END) DESC) as ranking
FROM students s
LEFT JOIN certificates c ON s.student_id = c.student_id
LEFT JOIN results res ON s.student_id = res.student_id
GROUP BY s.department
ORDER BY winning_count DESC;

-- ============================================================
-- TRIGGERS (run manually in MySQL CLI – not compatible with
-- the simple semicolon-based JS initializer)
-- ============================================================

