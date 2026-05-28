# Testing Report

This document outlines the test cases and results for the College Event Registration System.

## 1. Database Level Testing (SQL)

| Test Case ID | Description | Input | Expected Result | Status |
|---|---|---|---|---|
| DB-01 | Primary Key Constraint | Duplicate `student_id` | Error: Duplicate entry | ✅ Pass |
| DB-02 | Foreign Key Integrity | Delete event with registrations | Cascade delete registrations | ✅ Pass |
| DB-03 | Check Constraint | Year = 5 | Error: Check constraint violated | ✅ Pass |
| DB-04 | Unique Constraint | Duplicate Team Name in same event | Error: Duplicate entry | ✅ Pass |
| DB-05 | View Validation | Query `event_participation_summary` | Accurate counts from multiple tables | ✅ Pass |

## 2. Business Logic Testing

| Test Case ID | Description | Logic | Expected Result | Status |
|---|---|---|---|---|
| BL-01 | Team Size Limit | Add 6th member to a 5-max team | Registration blocked | ✅ Pass |
| BL-02 | Duplicate Registration | Student registers for same event twice | Blocked by Unique Constraint | ✅ Pass |
| BL-03 | Certificate Logic | Score 90, Rank 1 | Certificate Type: "Winner" | ✅ Pass |
| BL-04 | Certificate Logic | Score 40 | Certificate Type: "None" | ✅ Pass |

## 3. Frontend UI/UX Testing

| Test Case ID | Description | Action | Result | Status |
|---|---|---|---|---|
| UI-01 | Navigation | Click "Teams" in Sidebar | Teams page displays correctly | ✅ Pass |
| UI-02 | Search Filtering | Type "Rahul" in Student Search | Only Rahul's record remains | ✅ Pass |
| UI-03 | Responsive Design | Resize to Mobile Width | Sidebar hides, layout stacks | ✅ Pass |
| UI-04 | Form Submission | Add New Event via Modal | Toast success, list updates | ✅ Pass |

## 4. Performance Testing

| Test Case ID | Description | Metric | Result | Status |
|---|---|---|---|---|
| PERF-01 | Index Usage | Query on `department` | Index `idx_student_department` used | ✅ Pass |
| PERF-02 | Page Load | Initial dashboard load | < 200ms | ✅ Pass |

---
**Date of Testing**: May 16, 2026
**Testing Tool**: Manual & Scripted SQL Verification
