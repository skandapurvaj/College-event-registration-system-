-- ============================================================
-- COLLEGE EVENT REGISTRATION SYSTEM
-- Views & Indexes - views_indexes.sql
-- Syllabus Module X
-- ============================================================

-- ── VIEWS ───────────────────────────────────────────────────

-- View 1: Event Participation Summary (Module X)
CREATE OR REPLACE VIEW event_participation_summary AS
SELECT
    e.event_id,
    e.event_name,
    e.event_type,
    e.event_date,
    e.event_status,
    COUNT(DISTINCT r.student_id) AS total_participants,
    COUNT(DISTINCT t.team_id)    AS total_teams,
    ROUND(AVG(t.team_size), 2)   AS avg_team_size,
    COUNT(r.reg_id)              AS total_registrations
FROM events e
LEFT JOIN registrations r ON e.event_id = r.event_id
LEFT JOIN teams t         ON e.event_id = t.event_id
GROUP BY e.event_id, e.event_name, e.event_type, e.event_date, e.event_status;

-- Usage:
SELECT * FROM event_participation_summary ORDER BY total_participants DESC;

-- View 2: Student Performance Overview
CREATE OR REPLACE VIEW student_performance_overview AS
SELECT
    s.student_id,
    s.name,
    s.department,
    s.year,
    COUNT(DISTINCT r.event_id)         AS events_participated,
    COALESCE(SUM(res.final_score), 0)  AS total_score,
    COALESCE(ROUND(AVG(res.final_score), 2), 0) AS avg_score,
    COUNT(c.cert_id)                   AS certificates_earned
FROM students s
LEFT JOIN registrations r ON s.student_id = r.student_id AND r.status IN ('Confirmed','Completed')
LEFT JOIN results res      ON s.student_id = res.student_id
LEFT JOIN certificates c   ON s.student_id = c.student_id AND c.certificate_type != 'None'
GROUP BY s.student_id, s.name, s.department, s.year;

-- Usage:
SELECT * FROM student_performance_overview WHERE events_participated > 0 ORDER BY total_score DESC;

-- View 3: Department Analytics
CREATE OR REPLACE VIEW department_analytics AS
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

-- Usage:
SELECT * FROM department_analytics ORDER BY total_score DESC;

-- View 4: Team Leaderboard
CREATE OR REPLACE VIEW team_leaderboard AS
SELECT
    t.team_id,
    t.team_name,
    e.event_name,
    SUM(res.final_score)   AS total_score,
    COUNT(*)               AS member_results,
    ROUND(AVG(res.final_score), 2) AS avg_score,
    MIN(res.rank_position) AS best_rank
FROM results res
JOIN teams t  ON res.team_id  = t.team_id
JOIN events e ON res.event_id = e.event_id
GROUP BY t.team_id, t.team_name, e.event_name
ORDER BY total_score DESC;

-- Usage:
SELECT * FROM team_leaderboard LIMIT 10;

-- View 5: Certificate Eligibility View (CASE inside view)
CREATE OR REPLACE VIEW certificate_eligibility AS
SELECT
    s.student_id,
    s.name,
    e.event_name,
    res.final_score,
    res.rank_position,
    reg.attendance_status,
    CASE
        WHEN res.rank_position <= 3 AND reg.attendance_status = 'Present' THEN 'Winner'
        WHEN res.final_score   >= 60 AND reg.attendance_status = 'Present' THEN 'Participation'
        ELSE 'None'
    END AS determined_certificate
FROM results res
JOIN students      s   ON res.student_id = s.student_id
JOIN events        e   ON res.event_id   = e.event_id
JOIN registrations reg ON res.student_id = reg.student_id AND res.event_id = reg.event_id;

-- Usage:
SELECT * FROM certificate_eligibility ORDER BY determined_certificate DESC;

-- ── INDEXES ──────────────────────────────────────────────────
-- Purpose: Speed up frequent WHERE, JOIN, ORDER BY operations

CREATE INDEX idx_student_department ON students(department);
CREATE INDEX idx_student_year       ON students(year);
CREATE INDEX idx_event_date         ON events(event_date);
CREATE INDEX idx_event_status       ON events(event_status);
CREATE INDEX idx_event_type         ON events(event_type);
CREATE INDEX idx_registration_event   ON registrations(event_id);
CREATE INDEX idx_registration_student ON registrations(student_id);
CREATE INDEX idx_registration_status  ON registrations(status);
CREATE INDEX idx_results_event      ON results(event_id);
CREATE INDEX idx_results_student    ON results(student_id);
CREATE INDEX idx_results_score      ON results(score);
CREATE INDEX idx_results_rank       ON results(rank_position);
CREATE INDEX idx_team_event         ON teams(event_id);
CREATE INDEX idx_team_leader        ON teams(leader_id);
CREATE INDEX idx_certificate_type   ON certificates(certificate_type);
CREATE INDEX idx_certificate_student ON certificates(student_id);

-- ── EXPLAIN (Query Optimization Demo) ──────────────────────
-- Run EXPLAIN to see index usage:
EXPLAIN SELECT s.name, r.status
FROM students s
INNER JOIN registrations r ON s.student_id = r.student_id
WHERE s.department = 'CSE' AND r.status = 'Completed';

-- SHOW INDEX usage:
SHOW INDEXES FROM students;
SHOW INDEXES FROM registrations;
SHOW INDEXES FROM results;

-- ── COMPOSITE INDEXES ──────────────────────────────────────
-- Query acceleration for common operations
CREATE INDEX idx_student_event_registration 
ON registrations(student_id, event_id, status);

CREATE INDEX idx_event_team_result 
ON results(event_id, team_id, final_score DESC);

CREATE INDEX idx_student_department_year 
ON students(department, year);

-- ── ADDITIONAL VIEWS ────────────────────────────────────────

-- View 6: Department Rankings
CREATE OR REPLACE VIEW department_rankings AS
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

-- ── TRIGGERS ───────────────────────────────────────────────

DELIMITER //

CREATE TRIGGER auto_generate_certificate
AFTER INSERT ON results
FOR EACH ROW
BEGIN
    DECLARE cert_type VARCHAR(20);
    
    IF NEW.rank_position <= 3 THEN
        SET cert_type = 'Winner';
    ELSEIF NEW.final_score >= 60 THEN
        SET cert_type = 'Participation';
    ELSE
        SET cert_type = 'None';
    END IF;
    
    INSERT INTO certificates (student_id, event_id, team_id, certificate_type, score_obtained, rank_achieved, issued_date)
    VALUES (NEW.student_id, NEW.event_id, NEW.team_id, cert_type, NEW.final_score, NEW.rank_position, CURDATE());
END; //

DELIMITER ;
