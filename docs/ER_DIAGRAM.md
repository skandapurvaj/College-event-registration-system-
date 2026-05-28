# Entity Relationship Diagram (ER Model)

This diagram represents the logical structure of the College Event Registration System database.

```mermaid
erDiagram
    STUDENT ||--o{ REGISTRATION : registers
    STUDENT ||--o{ TEAM_MEMBER : joins
    STUDENT ||--o{ TEAM : leads
    STUDENT ||--o{ RESULT : obtains
    STUDENT ||--o{ CERTIFICATE : receives

    EVENT ||--o{ REGISTRATION : contains
    EVENT ||--o{ TEAM : hosts
    EVENT ||--o{ RESULT : records
    EVENT ||--o{ CERTIFICATE : issues
    
    STAFF ||--o{ EVENT : organizes

    TEAM ||--o{ TEAM_MEMBER : includes
    TEAM ||--o{ REGISTRATION : makes
    TEAM ||--o{ RESULT : achieves
    TEAM ||--o{ CERTIFICATE : awarded

    REGISTRATION }|--|| STUDENT : for
    REGISTRATION }|--|| EVENT : to
    REGISTRATION }|--o| TEAM : as

    RESULT }|--|| STUDENT : for
    RESULT }|--|| EVENT : of
    RESULT }|--o| TEAM : by

    TEAM_MEMBER }|--|| TEAM : part_of
    TEAM_MEMBER }|--|| STUDENT : identifies
```

## Entity Descriptions

### 1. Students
- **Primary Key**: `student_id`
- **Attributes**: `name`, `email` (Unique), `contact_no`, `department`, `year`, `gender`, `created_date`.
- **Relationships**: A student can register for multiple events, lead a team, be a member of multiple teams, and earn multiple certificates.

### 2. Events
- **Primary Key**: `event_id`
- **Attributes**: `event_name` (Unique), `event_type`, `venue`, `event_date`, `start_time`, `end_time`, `max_participants`, `description`, `event_status`.
- **Relationships**: Hosted by a staff member. Contains multiple registrations and teams.

### 3. Teams
- **Primary Key**: `team_id`
- **Attributes**: `team_name`, `event_id`, `leader_id`, `formation_date`, `team_size`, `status`.
- **Relationships**: Linked to a specific event. Led by one student. Contains multiple members.

### 4. Staff (Organizers)
- **Primary Key**: `staff_id`
- **Attributes**: `name`, `email`, `role`, `department`.
- **Relationships**: Manages/Organizes multiple events.

### 5. Registrations
- **Primary Key**: `reg_id`
- **Attributes**: `student_id`, `event_id`, `team_id`, `registration_type`, `status`, `attendance_status`.
- **Relationships**: Connects a student to an event. Optional link to a team.

### 6. Results
- **Primary Key**: `result_id`
- **Attributes**: `student_id`, `team_id`, `event_id`, `score`, `rank`, `final_score`.
- **Relationships**: Stores performance data for a student/team in an event.

### 7. Certificates
- **Primary Key**: `cert_id`
- **Attributes**: `student_id`, `event_id`, `certificate_type`, `certificate_number` (Unique).
- **Relationships**: Generated for students based on their results.
