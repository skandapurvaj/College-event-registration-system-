# College Event Registration System — DBMS Project

## Project Structure
```
DBMS PROJECT/
├── index.html          # Main application (Dashboard, all pages)
├── style.css           # Global CSS design system
├── app.js              # Frontend logic, navigation, CRUD
├── db.js               # Mock in-memory database (mirrors MySQL schema)
├── sql/
│   ├── schema.sql       # All CREATE TABLE, VIEW, INDEX statements
│   ├── sample_data.sql  # INSERT statements (15 students, 5 events, etc.)
│   ├── queries.sql      # All SQL queries organized by module
│   └── views_indexes.sql # Views and indexes (Module X)
└── docs/
    ├── ER_DIAGRAM.md           # Mermaid ER Diagram & Descriptions
    ├── PROJECT_REPORT.md       # Formal project report
    ├── TESTING_REPORT.md       # Quality assurance results
    └── VIVA_QUESTIONS_ANSWERS.md # Viva preparation guide
```

## How to Run
1. Open a terminal in this folder
2. Run: `python -m http.server 8765`
3. Open browser → `http://localhost:8765`

## Database Schema (8 Tables)
| Table | Purpose | Key Concepts |
|---|---|---|
| `staff` | Event organizers | PK, UNIQUE |
| `students` | Participant profiles | PK, UNIQUE, CHECK |
| `events` | Event details | FK, ENUM, CHECK |
| `teams` | Team formation | FK, composite UNIQUE |
| `team_members` | Many-to-Many junction | FK, composite UNIQUE |
| `registrations` | Event sign-ups | FK, composite UNIQUE |
| `results` | Scores & ranks | Generated column, FK |
| `certificates` | Certificate tracking | UNIQUE cert number |

## Syllabus Coverage

| Module | Topic | Implemented In |
|---|---|---|
| I & II | DDL, DML, Constraints | `schema.sql`, `queries.sql` |
| III | Operators (AND/OR/LIKE/BETWEEN/IN) | `queries.sql` Module III section |
| IV | WHERE, ORDER BY, LIMIT, DISTINCT | `queries.sql` Module IV section |
| V | COUNT, SUM, AVG, GROUP BY, HAVING | `queries.sql` Module V section |
| VI | CAST, CEIL, FLOOR, ROUND, string/date fns | `queries.sql` Module VI section |
| VII | CASE, UNION, INTERSECT, EXCEPT | `queries.sql` Module VII section |
| VIII | ER Model, FK, Relationships | `schema.sql` + ER diagram |
| IX | INNER/LEFT/RIGHT/CROSS/SELF JOIN | `queries.sql` Module IX section |
| X | Views, Indexes, Subqueries, EXPLAIN | `views_indexes.sql`, `queries.sql` |


live demo :
https://skandapurvaj.github.io/College-event-registration-system-/