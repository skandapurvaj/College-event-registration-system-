# VIVA Questions & Answers
## College Event Registration System

---

### Module I & II: Database Fundamentals & SQL Basics

**Q1: What is the difference between file systems and DBMS?**
> File systems store raw data without relationships or constraints. DBMS (like MySQL) provides structured storage, enforces relationships via FOREIGN KEY, prevents duplicates via UNIQUE, and supports concurrent access. In our project, `FOREIGN KEY (event_id) REFERENCES events(event_id)` in the `registrations` table ensures no registration can reference a non-existent event.

**Q2: What is DDL? Give examples from your project.**
> DDL = Data Definition Language. Commands that define structure. Examples from `schema.sql`:
> - `CREATE TABLE students (...)` — defines the table
> - `ALTER TABLE students ADD COLUMN profile_pic VARCHAR(255)` — modifies structure
> - `CREATE INDEX idx_student_department ON students(department)` — adds index
> - `CREATE VIEW event_participation_summary AS ...` — creates a view
> - `DROP TABLE IF EXISTS certificates` — removes table

**Q3: What constraints did you use?**
> - `PRIMARY KEY` — uniquely identifies each row (e.g., `student_id`, `event_id`)
> - `FOREIGN KEY` — enforces referential integrity (e.g., `registrations.event_id` → `events.event_id`)
> - `UNIQUE` — prevents duplicates (e.g., `email` in students, `(student_id, event_id)` in registrations)
> - `CHECK` — validates data (e.g., `year >= 1 AND year <= 4`, `score >= 0 AND score <= 100`)
> - `NOT NULL` — mandatory fields (e.g., `name`, `email`)
> - `DEFAULT` — fallback value (e.g., `status DEFAULT 'Registered'`)

**Q4: Explain the GENERATED ALWAYS AS column.**
> In `results` table: `final_score INT GENERATED ALWAYS AS (score - penalty_points) STORED`
> MySQL automatically calculates `final_score = score - penalty_points` on every INSERT/UPDATE. This ensures consistency — you never have a stale value.

---

### Module III: Operators

**Q5: How would you find all CSE students in Hackathon?**
```sql
SELECT s.name, s.department
FROM students s
INNER JOIN registrations r ON s.student_id = r.student_id
INNER JOIN events e ON r.event_id = e.event_id
WHERE s.department = 'CSE' AND e.event_type = 'Hackathon';
```

**Q6: Show a BETWEEN query.**
```sql
SELECT * FROM events WHERE event_date BETWEEN '2024-05-01' AND '2024-07-01';
```

---

### Module IV: Filtering & Sorting

**Q7: How did you implement pagination in the leaderboard?**
```sql
SELECT t.team_name, SUM(r.final_score) as total_score
FROM results r
JOIN teams t ON r.team_id = t.team_id
WHERE r.event_id = 1
GROUP BY t.team_id, t.team_name
ORDER BY total_score DESC
LIMIT 10 OFFSET 0;   -- Page 1
-- LIMIT 10 OFFSET 10;  -- Page 2
```

---

### Module V: Aggregations

**Q8: Difference between WHERE and HAVING?**
> - `WHERE` filters individual rows **before** grouping
> - `HAVING` filters groups **after** `GROUP BY`
```sql
-- WHERE filters rows first:
SELECT department, COUNT(*) FROM students WHERE year >= 2 GROUP BY department;
-- HAVING filters groups:
SELECT department, COUNT(*) FROM students GROUP BY department HAVING COUNT(*) > 3;
```

---

### Module VII: CASE & Set Operations

**Q9: How did CASE determine certificate eligibility?**
```sql
CASE
  WHEN rank_position <= 3 AND attendance_status = 'Present' THEN 'Winner'
  WHEN final_score >= 60 AND attendance_status = 'Present'  THEN 'Participation'
  ELSE 'None'
END AS certificate_type
```
> Logic: Top 3 ranks who attended get Winner certificates. Score ≥ 60 and attended get Participation. Others get None.

**Q10: UNION vs UNION ALL?**
> `UNION` removes duplicates. `UNION ALL` keeps all rows including duplicates. Use `UNION` when combining winner + participant lists to avoid showing someone twice.

---

### Module VIII: ER Model

**Q11: Draw and explain your ER model.**
```
students ──< registrations >── events
    |                               |
    └──< team_members >── teams ───┘
                                    |
                               results
                                    |
                            certificates
```
- **One-to-Many:** One event → many registrations
- **Many-to-Many:** Students ↔ Teams (via `team_members` junction table)
- **One-to-Many:** Team → Results

**Q12: Why is a junction table needed?**
> A student can be in many teams (across events), and a team has many students. This is Many-to-Many. SQL cannot represent this directly — you need `team_members(team_id, student_id)` as a bridge table with FOREIGN KEYs to both sides.

---

### Module IX: Joins

**Q13: When would you use LEFT JOIN vs INNER JOIN?**
> - `INNER JOIN` returns only matching rows (students who ARE registered)
> - `LEFT JOIN` returns ALL left-table rows even with no match (ALL students, showing 0 if not registered)
```sql
-- LEFT JOIN: Show all students including those with no registrations
SELECT s.name, COUNT(r.reg_id) AS event_count
FROM students s
LEFT JOIN registrations r ON s.student_id = r.student_id
GROUP BY s.student_id;
```

**Q14: Show a SELF JOIN from your project.**
```sql
-- Find pairs of students in same department
SELECT s1.name AS student1, s2.name AS student2, s1.department
FROM students s1
INNER JOIN students s2 ON s1.department = s2.department AND s1.student_id < s2.student_id;
```

---

### Module X: Views & Indexes

**Q15: Why did you create views?**
> Views encapsulate complex multi-table queries so they can be reused like a table. Example: `event_participation_summary` joins 3 tables with aggregations — instead of rewriting this every time, we `SELECT * FROM event_participation_summary`.

**Q16: How do indexes improve performance?**
> Without index: MySQL scans every row (full table scan). With `CREATE INDEX idx_student_department ON students(department)`, MySQL builds a B-tree lookup structure. `WHERE department = 'CSE'` jumps directly to those rows — O(log n) instead of O(n).

**Q17: Show a subquery example.**
```sql
-- Students who scored above average (subquery in WHERE)
SELECT name, final_score FROM results
JOIN students s ON results.student_id = s.student_id
WHERE final_score > (SELECT AVG(final_score) FROM results WHERE event_id = 1)
  AND event_id = 1;
```
