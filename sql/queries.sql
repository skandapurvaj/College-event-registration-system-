-- ============================================================
-- COLLEGE EVENT REGISTRATION SYSTEM
-- All Implemented Queries - queries.sql
-- Organized by Syllabus Module
-- ============================================================

-- ============================================================
-- MODULE I & II: DDL & DML OPERATIONS
-- ============================================================

-- ALTER TABLE example: Add a field to students
-- ALTER TABLE students ADD COLUMN profile_pic VARCHAR(255);

-- UPDATE: Change student contact
UPDATE students SET contact_no = '9999999999' WHERE student_id = 1;

-- SELECT all students by department
SELECT * FROM students WHERE department = 'CSE' ORDER BY year DESC;

-- INSERT a new student (DML - Module II)
-- INSERT INTO students (name, email, department, year, gender) 
-- VALUES ('Test User', 'test@college.com', 'IT', 2, 'Male');

-- DELETE with constraint check (will fail if registrations exist)
-- DELETE FROM students WHERE student_id = 99;

-- ============================================================
-- MODULE III: OPERATORS
-- ============================================================

-- Comparison operators: =, !=, <, >, <=, >=
SELECT name, year, department FROM students
WHERE year >= 3 AND department != 'MECH';

-- Logical operators: AND, OR, NOT
SELECT * FROM events
WHERE (event_type = 'Hackathon' OR event_type = 'CodeContest')
  AND event_status != 'Cancelled';

-- LIKE pattern matching
SELECT * FROM students WHERE name LIKE 'R%';
SELECT * FROM events  WHERE event_name LIKE '%2024%';

-- IN operator
SELECT * FROM students WHERE department IN ('CSE', 'IT', 'ECE');

-- BETWEEN operator (date range)
SELECT * FROM events WHERE event_date BETWEEN '2024-05-01' AND '2024-07-01';

-- IS NULL / IS NOT NULL
SELECT * FROM registrations WHERE team_id IS NULL;
SELECT * FROM registrations WHERE team_id IS NOT NULL;

-- ============================================================
-- MODULE IV: FILTERING & SORTING
-- ============================================================

-- WHERE + ORDER BY + LIMIT (pagination)
SELECT student_id, name, department, year FROM students
WHERE department = 'CSE'
ORDER BY year DESC, name ASC
LIMIT 5 OFFSET 0;

-- DISTINCT departments
SELECT DISTINCT department FROM students ORDER BY department;

-- Top 10 registrations (LIMIT)
SELECT r.reg_id, s.name, e.event_name, r.status
FROM registrations r
JOIN students s ON r.student_id = s.student_id
JOIN events   e ON r.event_id   = e.event_id
ORDER BY r.registration_date DESC
LIMIT 10;

-- ============================================================
-- MODULE V: AGGREGATE FUNCTIONS & GROUP BY
-- ============================================================

-- COUNT: Total students per department
SELECT department, COUNT(*) AS student_count
FROM students GROUP BY department ORDER BY student_count DESC;

-- SUM, AVG, MAX, MIN: Scores per event
SELECT
    e.event_name,
    COUNT(res.result_id)             AS total_entries,
    SUM(res.final_score)             AS total_score,
    ROUND(AVG(res.final_score), 2)   AS avg_score,
    MAX(res.final_score)             AS highest_score,
    MIN(res.final_score)             AS lowest_score
FROM results res
JOIN events e ON res.event_id = e.event_id
GROUP BY e.event_id, e.event_name;

-- HAVING: Events with participation > 5
SELECT
    e.event_name,
    COUNT(DISTINCT r.student_id) AS participant_count
FROM events e
LEFT JOIN registrations r ON e.event_id = r.event_id
GROUP BY e.event_id, e.event_name
HAVING COUNT(DISTINCT r.student_id) > 5;

-- Group BY department: Participation analytics
SELECT
    s.department,
    COUNT(DISTINCT s.student_id)  AS total_students,
    COUNT(DISTINCT r.event_id)    AS events_participated,
    ROUND(AVG(res.final_score), 2) AS avg_score,
    SUM(res.final_score)           AS total_score
FROM students s
LEFT JOIN registrations r ON s.student_id = r.student_id AND r.status IN ('Confirmed','Completed')
LEFT JOIN results res      ON s.student_id = res.student_id
GROUP BY s.department
ORDER BY total_score DESC;

-- ============================================================
-- MODULE VI: FUNCTIONS (CAST, CEIL, FLOOR, ROUND, String, Date)
-- ============================================================

-- CAST: Convert score to VARCHAR
SELECT student_id, name, CAST(year AS CHAR) AS year_str FROM students;

-- CEIL, FLOOR, ROUND
SELECT
    student_id,
    name,
    final_score,
    CEIL(final_score  / 10.0) * 10 AS rounded_up,
    FLOOR(final_score / 10.0) * 10 AS rounded_down,
    ROUND(final_score / 10.0, 1)   AS rounded_one
FROM results WHERE event_id = 1;

-- String functions: UPPER, LOWER, CONCAT, LENGTH
SELECT
    UPPER(name)                         AS name_upper,
    LOWER(email)                        AS email_lower,
    CONCAT(name, ' (', department, ')') AS display_name,
    LENGTH(name)                        AS name_length
FROM students LIMIT 5;

-- Date functions: YEAR, MONTH, DATE, CURDATE, NOW
SELECT
    YEAR(registration_date)  AS reg_year,
    MONTH(registration_date) AS reg_month,
    DATE(registration_date)  AS reg_date,
    COUNT(*)                 AS registrations
FROM registrations
GROUP BY YEAR(registration_date), MONTH(registration_date)
ORDER BY reg_year DESC, reg_month DESC;

-- ============================================================
-- MODULE VII: CASE CLAUSE & SET OPERATIONS
-- ============================================================

-- CASE: Certificate eligibility determination
SELECT
    s.name,
    e.event_name,
    res.final_score,
    res.rank_position,
    reg.attendance_status,
    CASE
        WHEN res.rank_position <= 3 AND reg.attendance_status = 'Present' THEN 'Winner'
        WHEN res.final_score   >= 60 AND reg.attendance_status = 'Present' THEN 'Participation'
        ELSE 'None'
    END AS certificate_type
FROM results res
JOIN students     s   ON res.student_id = s.student_id
JOIN events       e   ON res.event_id   = e.event_id
JOIN registrations reg ON res.student_id = reg.student_id AND res.event_id = reg.event_id
ORDER BY e.event_id, res.rank_position;

-- CASE with performance category
SELECT
    s.student_id,
    s.name,
    SUM(res.final_score) AS total_score,
    CASE
        WHEN SUM(res.final_score) >= 90 THEN 'Excellent'
        WHEN SUM(res.final_score) >= 75 THEN 'Good'
        WHEN SUM(res.final_score) >= 60 THEN 'Average'
        ELSE 'Below Average'
    END AS performance_category,
    CEIL(SUM(res.final_score) / 10.0) * 10 AS rounded_score
FROM results res
JOIN students s ON res.student_id = s.student_id
GROUP BY s.student_id, s.name;

-- UNION: Combine all eligible students (winners + participants)
SELECT s.student_id, s.name, r.event_id, 'Winner' AS category
FROM results r
JOIN students s ON r.student_id = s.student_id
WHERE r.rank_position <= 3
UNION
SELECT s.student_id, s.name, r.event_id, 'Participation' AS category
FROM results r
JOIN students s ON r.student_id = s.student_id
WHERE r.final_score >= 60 AND r.rank_position > 3
ORDER BY category, student_id;

-- UNION ALL (includes duplicates)
SELECT student_id FROM registrations WHERE event_id = 1
UNION ALL
SELECT student_id FROM registrations WHERE event_id = 2;

-- INTERSECT equivalent in MySQL (students in BOTH event 1 and event 2)
SELECT DISTINCT r1.student_id
FROM registrations r1
WHERE r1.event_id = 1
  AND r1.student_id IN (
    SELECT r2.student_id FROM registrations r2 WHERE r2.event_id = 2
  );

-- EXCEPT equivalent in MySQL (registered but no results submitted)
SELECT r.student_id FROM registrations r WHERE r.event_id = 1
  AND r.student_id NOT IN (
    SELECT res.student_id FROM results res WHERE res.event_id = 1 AND res.student_id IS NOT NULL
  );

-- ============================================================
-- MODULE VIII: ER MODEL / RELATIONSHIP QUERIES
-- ============================================================

-- One-to-Many: Event → Registrations
SELECT e.event_name, COUNT(r.reg_id) AS registrations
FROM events e
LEFT JOIN registrations r ON e.event_id = r.event_id
GROUP BY e.event_id, e.event_name;

-- Many-to-Many: Student ↔ Team (via team_members)
SELECT s.name, t.team_name, t.event_id, tm.role
FROM team_members tm
JOIN students s ON tm.student_id = s.student_id
JOIN teams    t ON tm.team_id    = t.team_id
ORDER BY t.event_id, t.team_name;

-- Teams with member count + leader name
SELECT
    t.team_id,
    t.team_name,
    s.name AS leader_name,
    COUNT(tm.member_id) AS member_count,
    t.status
FROM teams t
JOIN students     s  ON t.leader_id  = s.student_id
LEFT JOIN team_members tm ON t.team_id = tm.team_id
GROUP BY t.team_id, t.team_name, s.name, t.status
HAVING COUNT(tm.member_id) BETWEEN 1 AND 5;

-- ============================================================
-- MODULE IX: JOIN QUERIES
-- ============================================================

-- INNER JOIN: Students registered for event 1
SELECT DISTINCT s.student_id, s.name, s.department, r.registration_date, r.status
FROM students s
INNER JOIN registrations r ON s.student_id = r.student_id
WHERE r.event_id = 1 AND r.status != 'Cancelled'
ORDER BY r.registration_date;

-- LEFT JOIN: All students and how many events they registered for
SELECT s.student_id, s.name, s.department, COUNT(r.reg_id) AS event_count
FROM students s
LEFT JOIN registrations r ON s.student_id = r.student_id AND r.status IN ('Confirmed','Completed')
GROUP BY s.student_id, s.name, s.department
ORDER BY event_count DESC;

-- RIGHT JOIN: All teams and their registrations count
SELECT t.team_name, COUNT(r.reg_id) AS registrations
FROM registrations r
RIGHT JOIN teams t ON r.team_id = t.team_id
GROUP BY t.team_id, t.team_name;

-- Multiple JOINs: Event + Student + Team details
SELECT
    e.event_name,
    s.name         AS student_name,
    t.team_name,
    r.registration_date,
    r.status,
    r.attendance_status
FROM registrations r
INNER JOIN events   e ON r.event_id   = e.event_id
INNER JOIN students s ON r.student_id = s.student_id
LEFT  JOIN teams    t ON r.team_id    = t.team_id
WHERE e.event_id = 1
ORDER BY r.registration_date DESC
LIMIT 20 OFFSET 0;

-- SELF JOIN: Find students in the same department
SELECT
    s1.name AS student1,
    s2.name AS student2,
    s1.department
FROM students s1
INNER JOIN students s2 ON s1.department = s2.department AND s1.student_id < s2.student_id
ORDER BY s1.department;

-- NATURAL JOIN (shared column name 'student_id')
-- SELECT * FROM students NATURAL JOIN registrations LIMIT 10;

-- CROSS JOIN: All student-event combinations
SELECT s.name, e.event_name
FROM students s
CROSS JOIN events e
WHERE s.department = 'CSE'
LIMIT 20;

-- ============================================================
-- MODULE X: VIEWS, SUBQUERIES & INDEXES
-- ============================================================

-- Query a view
SELECT * FROM event_participation_summary ORDER BY total_participants DESC;

-- Query student performance view
SELECT * FROM student_performance_overview
WHERE events_participated > 0
ORDER BY total_score DESC;

-- Subquery in WHERE: Students who scored above average
SELECT s.name, res.final_score
FROM results res
JOIN students s ON res.student_id = s.student_id
WHERE res.final_score > (SELECT AVG(final_score) FROM results WHERE event_id = 1)
  AND res.event_id = 1
ORDER BY res.final_score DESC;

-- Subquery in FROM (derived table)
SELECT dept_avg.department, dept_avg.avg_score
FROM (
    SELECT s.department, ROUND(AVG(res.final_score), 2) AS avg_score
    FROM results res
    JOIN students s ON res.student_id = s.student_id
    GROUP BY s.department
) AS dept_avg
WHERE dept_avg.avg_score > 70;

-- Subquery in SELECT: Events with participant count
SELECT
    event_name,
    event_type,
    event_date,
    (SELECT COUNT(DISTINCT student_id) FROM registrations r WHERE r.event_id = e.event_id) AS participants
FROM events e
ORDER BY event_date;

-- Top 10 leaderboard (team)
SELECT
    t.team_id,
    t.team_name,
    SUM(res.final_score)  AS total_score,
    COUNT(*)              AS submissions,
    AVG(res.final_score)  AS avg_score
FROM results res
JOIN teams t ON res.team_id = t.team_id
WHERE res.event_id = 1
GROUP BY t.team_id, t.team_name
ORDER BY total_score DESC
LIMIT 10;

-- EXPLAIN for query optimization (Module X)
EXPLAIN SELECT s.name, r.status
FROM students s
INNER JOIN registrations r ON s.student_id = r.student_id
WHERE s.department = 'CSE';
