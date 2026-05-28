# Project Report: College Event Registration System

## 1. Introduction
The **College Event Registration System** is a comprehensive database-driven application designed to streamline the management of academic and extracurricular events. It handles student profiles, team formations, event scheduling, real-time leaderboards, and automated certificate eligibility.

## 2. Objectives
- To automate the student registration process for various college events.
- To manage team-based competitions efficiently.
- To provide real-time analytics and rankings.
- To ensure data integrity and referential transparency using advanced DBMS concepts.

## 3. Technology Stack
- **Database**: MySQL (Standard SQL-92/99 compliant)
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+)
- **Architecture**: Single Page Application (SPA) with a Mock Database Layer for demonstration.

## 4. Database Design (Modules I-X)
The database was designed following normalization principles to eliminate redundancy.

### Core Modules Implemented:
- **Module 1 & 2 (DDL/DML)**: Tables for Students, Events, and Staff with strict constraints.
- **Module 3 (Operators)**: Complex filtering using `LIKE`, `BETWEEN`, and `IN`.
- **Module 5 (Aggregations)**: Real-time calculation of average scores and participation counts.
- **Module 7 (Case & Sets)**: Logic for certificate types and combining student data.
- **Module IX (Joins)**: Extensive use of `INNER JOIN` and `LEFT JOIN` for reporting.
- **Module X (Views & Indexes)**: Optimized performance via B-Tree indexes and reusable views.

## 5. Key Features
1. **Dynamic Dashboard**: Overview of total events, participants, and upcoming activities.
2. **Team Management**: Robust system to form teams, assign leaders, and validate sizes.
3. **Automated Leaderboard**: Instant ranking calculation based on scores and penalties.
4. **Certificate Engine**: Conditional logic to flag "Winner" vs "Participation" status.
5. **Analytics Suite**: Department-wise performance tracking and participation trends.

## 6. Implementation Highlights
- **Referential Integrity**: Cascading deletes on events ensure no orphaned records.
- **Data Validation**: `CHECK` constraints on years and scores prevent invalid data entry.
- **Unique Constraints**: Prevent duplicate student registrations in the same event.

## 7. Conclusion
The project successfully demonstrates the application of all 10 modules of the DBMS syllabus. It provides a scalable and user-friendly solution for managing college-scale events while maintaining high standards of data consistency.

---
**Developed by**: Antigravity AI
**Academic Year**: 2024-2025
