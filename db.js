// ============================================================
// db.js – In-memory mock database (replaces MySQL for browser demo)
// All data mirrors the SQL sample_data.sql exactly
// ============================================================

const DB = {

  staff: [
    { staff_id:101, name:'Dr. A. Sharma',  email:'sharma@college.edu', role:'HOD',         department:'CSE'  },
    { staff_id:102, name:'Prof. R. Verma', email:'verma@college.edu',  role:'Organizer',   department:'ECE'  },
    { staff_id:103, name:'Dr. P. Nair',    email:'nair@college.edu',   role:'Organizer',   department:'IT'   },
    { staff_id:104, name:'Prof. S. Mehta', email:'mehta@college.edu',  role:'Coordinator', department:'MECH' },
  ],

  students: [
    { student_id:1,  name:'Rahul Kumar',    email:'rahul@college.com',   contact_no:'9876543210', department:'CSE',  year:3, gender:'Male'   },
    { student_id:2,  name:'Priya Singh',    email:'priya@college.com',   contact_no:'9876543211', department:'ECE',  year:2, gender:'Female' },
    { student_id:3,  name:'Amit Patel',     email:'amit@college.com',    contact_no:'9876543212', department:'CSE',  year:3, gender:'Male'   },
    { student_id:4,  name:'Sneha Reddy',    email:'sneha@college.com',   contact_no:'9876543213', department:'IT',   year:4, gender:'Female' },
    { student_id:5,  name:'Vikram Joshi',   email:'vikram@college.com',  contact_no:'9876543214', department:'CSE',  year:2, gender:'Male'   },
    { student_id:6,  name:'Anjali Gupta',   email:'anjali@college.com',  contact_no:'9876543215', department:'ECE',  year:3, gender:'Female' },
    { student_id:7,  name:'Rohit Sharma',   email:'rohit@college.com',   contact_no:'9876543216', department:'MECH', year:1, gender:'Male'   },
    { student_id:8,  name:'Kavya Menon',    email:'kavya@college.com',   contact_no:'9876543217', department:'IT',   year:3, gender:'Female' },
    { student_id:9,  name:'Arjun Nair',     email:'arjun@college.com',   contact_no:'9876543218', department:'CSE',  year:4, gender:'Male'   },
    { student_id:10, name:'Divya Pillai',   email:'divya@college.com',   contact_no:'9876543219', department:'ECE',  year:2, gender:'Female' },
    { student_id:11, name:'Karan Malhotra', email:'karan@college.com',   contact_no:'9876543220', department:'CSE',  year:1, gender:'Male'   },
    { student_id:12, name:'Meera Iyer',     email:'meera@college.com',   contact_no:'9876543221', department:'IT',   year:2, gender:'Female' },
    { student_id:13, name:'Suresh Babu',    email:'suresh@college.com',  contact_no:'9876543222', department:'MECH', year:3, gender:'Male'   },
    { student_id:14, name:'Nisha Tiwari',   email:'nisha@college.com',   contact_no:'9876543223', department:'CSE',  year:4, gender:'Female' },
    { student_id:15, name:'Dev Anand',      email:'dev@college.com',     contact_no:'9876543224', department:'ECE',  year:3, gender:'Male'   },
  ],

  events: [
    { event_id:1, event_name:'Smart India Hackathon 2024',    event_type:'Hackathon',   venue:'Auditorium, Block A',    event_date:'2024-05-25', start_time:'09:00', end_time:'17:00', max_participants:100, min_team_size:2, max_team_size:5, description:'Annual national-level hackathon for innovative solutions.', organizer_id:101, event_status:'Completed', emoji:'🚀' },
    { event_id:2, event_name:'CodeQuest Programming Contest', event_type:'CodeContest', venue:'Lab 3, Computer Center', event_date:'2024-06-02', start_time:'10:00', end_time:'13:00', max_participants:80,  min_team_size:1, max_team_size:3, description:'Competitive programming with algorithmic problems.',       organizer_id:102, event_status:'Completed', emoji:'💻' },
    { event_id:3, event_name:'Paper Presentation',            event_type:'Presentation',venue:'Seminar Hall, Block B',  event_date:'2024-06-10', start_time:'09:30', end_time:'16:00', max_participants:60,  min_team_size:1, max_team_size:2, description:'Research paper presentation for final year students.',     organizer_id:103, event_status:'Upcoming', emoji:'📄' },
    { event_id:4, event_name:'Gaming Tournament',             event_type:'Gaming',      venue:'Sports Complex',          event_date:'2024-06-18', start_time:'14:00', end_time:'20:00', max_participants:120, min_team_size:1, max_team_size:4, description:'Multi-game esports tournament.',                           organizer_id:104, event_status:'Upcoming', emoji:'🎮' },
    { event_id:5, event_name:'Quiz Competition',              event_type:'Quiz',        venue:'Seminar Hall, Block A',  event_date:'2024-06-25', start_time:'11:00', end_time:'13:00', max_participants:50,  min_team_size:1, max_team_size:2, description:'General knowledge and technical quiz.',                    organizer_id:101, event_status:'Upcoming', emoji:'❓' },
  ],

  teams: [
    { team_id:1, team_name:'Code Warriors',        event_id:1, leader_id:1,  team_size:3, status:'Active' },
    { team_id:2, team_name:'Bug Avengers',          event_id:1, leader_id:4,  team_size:3, status:'Active' },
    { team_id:3, team_name:'Syntax Squad',          event_id:1, leader_id:9,  team_size:2, status:'Active' },
    { team_id:4, team_name:'Null Pointers',         event_id:1, leader_id:5,  team_size:2, status:'Active' },
    { team_id:5, team_name:'Algorithmic Thinkers',  event_id:1, leader_id:14, team_size:3, status:'Active' },
    { team_id:6, team_name:'AlgoMasters',           event_id:2, leader_id:3,  team_size:2, status:'Active' },
    { team_id:7, team_name:'Debug Dragons',         event_id:2, leader_id:8,  team_size:2, status:'Active' },
  ],

  team_members: [
    { member_id:1,  team_id:1, student_id:1,  role:'Leader' },
    { member_id:2,  team_id:1, student_id:2,  role:'Member' },
    { member_id:3,  team_id:1, student_id:3,  role:'Member' },
    { member_id:4,  team_id:2, student_id:4,  role:'Leader' },
    { member_id:5,  team_id:2, student_id:5,  role:'Member' },
    { member_id:6,  team_id:2, student_id:6,  role:'Member' },
    { member_id:7,  team_id:3, student_id:9,  role:'Leader' },
    { member_id:8,  team_id:3, student_id:8,  role:'Member' },
    { member_id:9,  team_id:4, student_id:5,  role:'Leader' },
    { member_id:10, team_id:4, student_id:11, role:'Member' },
    { member_id:11, team_id:5, student_id:14, role:'Leader' },
    { member_id:12, team_id:5, student_id:13, role:'Member' },
    { member_id:13, team_id:5, student_id:12, role:'Member' },
    { member_id:14, team_id:6, student_id:3,  role:'Leader' },
    { member_id:15, team_id:6, student_id:7,  role:'Member' },
    { member_id:16, team_id:7, student_id:8,  role:'Leader' },
    { member_id:17, team_id:7, student_id:15, role:'Member' },
  ],

  registrations: [
    { reg_id:1,  student_id:1,  event_id:1, team_id:1, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:2,  student_id:2,  event_id:1, team_id:1, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:3,  student_id:3,  event_id:1, team_id:1, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:4,  student_id:4,  event_id:1, team_id:2, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:5,  student_id:5,  event_id:1, team_id:2, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:6,  student_id:6,  event_id:1, team_id:2, registration_type:'Team',       status:'Completed', attendance_status:'Absent',  payment_status:'Paid' },
    { reg_id:7,  student_id:9,  event_id:1, team_id:3, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:8,  student_id:8,  event_id:1, team_id:3, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:9,  student_id:14, event_id:1, team_id:5, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:10, student_id:13, event_id:1, team_id:5, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'Paid' },
    { reg_id:11, student_id:12, event_id:1, team_id:5, registration_type:'Team',       status:'Completed', attendance_status:'Absent',  payment_status:'Paid' },
    { reg_id:12, student_id:3,  event_id:2, team_id:6, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'NA'   },
    { reg_id:13, student_id:7,  event_id:2, team_id:6, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'NA'   },
    { reg_id:14, student_id:8,  event_id:2, team_id:7, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'NA'   },
    { reg_id:15, student_id:15, event_id:2, team_id:7, registration_type:'Team',       status:'Completed', attendance_status:'Present', payment_status:'NA'   },
    { reg_id:16, student_id:11, event_id:2, team_id:null, registration_type:'Individual', status:'Confirmed', attendance_status:'Pending', payment_status:'NA' },
    { reg_id:17, student_id:1,  event_id:3, team_id:null, registration_type:'Individual', status:'Registered',attendance_status:'Pending', payment_status:'NA' },
    { reg_id:18, student_id:9,  event_id:3, team_id:null, registration_type:'Individual', status:'Registered',attendance_status:'Pending', payment_status:'NA' },
    { reg_id:19, student_id:4,  event_id:4, team_id:null, registration_type:'Individual', status:'Registered',attendance_status:'Pending', payment_status:'NA' },
    { reg_id:20, student_id:10, event_id:4, team_id:null, registration_type:'Individual', status:'Registered',attendance_status:'Pending', payment_status:'NA' },
    { reg_id:21, student_id:2,  event_id:5, team_id:null, registration_type:'Individual', status:'Registered',attendance_status:'Pending', payment_status:'NA' },
    { reg_id:22, student_id:6,  event_id:5, team_id:null, registration_type:'Individual', status:'Registered',attendance_status:'Pending', payment_status:'NA' },
  ],

  results: [
    { result_id:1,  team_id:1, student_id:1,  event_id:1, score:90, rank_position:1, completion_time:460, penalty_points:5,  final_score:85 },
    { result_id:2,  team_id:1, student_id:2,  event_id:1, score:88, rank_position:1, completion_time:460, penalty_points:3,  final_score:85 },
    { result_id:3,  team_id:1, student_id:3,  event_id:1, score:85, rank_position:1, completion_time:460, penalty_points:0,  final_score:85 },
    { result_id:4,  team_id:2, student_id:4,  event_id:1, score:82, rank_position:2, completion_time:490, penalty_points:5,  final_score:77 },
    { result_id:5,  team_id:2, student_id:5,  event_id:1, score:80, rank_position:2, completion_time:490, penalty_points:0,  final_score:80 },
    { result_id:6,  team_id:3, student_id:9,  event_id:1, score:78, rank_position:3, completion_time:510, penalty_points:0,  final_score:78 },
    { result_id:7,  team_id:3, student_id:8,  event_id:1, score:76, rank_position:3, completion_time:510, penalty_points:2,  final_score:74 },
    { result_id:8,  team_id:5, student_id:14, event_id:1, score:70, rank_position:4, completion_time:540, penalty_points:0,  final_score:70 },
    { result_id:9,  team_id:5, student_id:13, event_id:1, score:68, rank_position:4, completion_time:540, penalty_points:3,  final_score:65 },
    { result_id:10, team_id:6, student_id:3,  event_id:2, score:95, rank_position:1, completion_time:120, penalty_points:0,  final_score:95 },
    { result_id:11, team_id:6, student_id:7,  event_id:2, score:80, rank_position:2, completion_time:135, penalty_points:5,  final_score:75 },
    { result_id:12, team_id:7, student_id:8,  event_id:2, score:88, rank_position:1, completion_time:115, penalty_points:0,  final_score:88 },
    { result_id:13, team_id:7, student_id:15, event_id:2, score:72, rank_position:3, completion_time:140, penalty_points:0,  final_score:72 },
  ],

  certificates: [
    { cert_id:1,  student_id:1,  event_id:1, team_id:1, certificate_type:'Winner',        score_obtained:85, rank_achieved:1, issued_date:'2024-06-01', certificate_number:'CERT-2024-001', status:'Distributed' },
    { cert_id:2,  student_id:2,  event_id:1, team_id:1, certificate_type:'Winner',        score_obtained:85, rank_achieved:1, issued_date:'2024-06-01', certificate_number:'CERT-2024-002', status:'Distributed' },
    { cert_id:3,  student_id:3,  event_id:1, team_id:1, certificate_type:'Winner',        score_obtained:85, rank_achieved:1, issued_date:'2024-06-01', certificate_number:'CERT-2024-003', status:'Distributed' },
    { cert_id:4,  student_id:4,  event_id:1, team_id:2, certificate_type:'Winner',        score_obtained:77, rank_achieved:2, issued_date:'2024-06-01', certificate_number:'CERT-2024-004', status:'Printed' },
    { cert_id:5,  student_id:5,  event_id:1, team_id:2, certificate_type:'Winner',        score_obtained:80, rank_achieved:2, issued_date:'2024-06-01', certificate_number:'CERT-2024-005', status:'Printed' },
    { cert_id:6,  student_id:9,  event_id:1, team_id:3, certificate_type:'Winner',        score_obtained:78, rank_achieved:3, issued_date:'2024-06-01', certificate_number:'CERT-2024-006', status:'Generated' },
    { cert_id:7,  student_id:8,  event_id:1, team_id:3, certificate_type:'Winner',        score_obtained:74, rank_achieved:3, issued_date:'2024-06-01', certificate_number:'CERT-2024-007', status:'Generated' },
    { cert_id:8,  student_id:14, event_id:1, team_id:5, certificate_type:'Participation', score_obtained:70, rank_achieved:4, issued_date:'2024-06-01', certificate_number:'CERT-2024-008', status:'Generated' },
    { cert_id:9,  student_id:13, event_id:1, team_id:5, certificate_type:'Participation', score_obtained:65, rank_achieved:4, issued_date:'2024-06-01', certificate_number:'CERT-2024-009', status:'Generated' },
    { cert_id:10, student_id:3,  event_id:2, team_id:6, certificate_type:'Winner',        score_obtained:95, rank_achieved:1, issued_date:'2024-06-10', certificate_number:'CERT-2024-010', status:'Distributed' },
    { cert_id:11, student_id:8,  event_id:2, team_id:7, certificate_type:'Winner',        score_obtained:88, rank_achieved:1, issued_date:'2024-06-10', certificate_number:'CERT-2024-011', status:'Distributed' },
    { cert_id:12, student_id:7,  event_id:2, team_id:6, certificate_type:'Participation', score_obtained:75, rank_achieved:2, issued_date:'2024-06-10', certificate_number:'CERT-2024-012', status:'Generated' },
    { cert_id:13, student_id:15, event_id:2, team_id:7, certificate_type:'Participation', score_obtained:72, rank_achieved:3, issued_date:'2024-06-10', certificate_number:'CERT-2024-013', status:'Generated' },
  ],
};

// ── Helper: get student by id ──────────────────────────────
DB.getStudent  = id => DB.students.find(s => s.student_id  === id);
DB.getEvent    = id => DB.events.find(e   => e.event_id    === id);
DB.getTeam     = id => DB.teams.find(t    => t.team_id     === id);

// ── Analytics helpers (simulate SQL aggregate queries) ──────

/** Total distinct participants across all events */
DB.totalParticipants = () => new Set(DB.registrations.map(r => r.student_id)).size;

/** Total active teams */
DB.totalTeams = () => DB.teams.filter(t => t.status === 'Active').length;

/** Events completed */
DB.completedEvents = () => DB.events.filter(e => e.event_status === 'Completed').length;

/** Participants per event (simulates LEFT JOIN + GROUP BY + COUNT) */
DB.participantsPerEvent = () =>
  DB.events.map(e => ({
    ...e,
    participants: new Set(DB.registrations.filter(r => r.event_id === e.event_id).map(r => r.student_id)).size,
    teams: DB.teams.filter(t => t.event_id === e.event_id).length,
  }));

/** Team leaderboard for event (simulates GROUP BY team, SUM score) */
DB.teamLeaderboard = (eventId) => {
  const rows = DB.results.filter(r => r.event_id === eventId && r.team_id != null);
  const map = {};
  rows.forEach(r => {
    if (!map[r.team_id]) map[r.team_id] = { team_id: r.team_id, total: 0, count: 0 };
    map[r.team_id].total += r.final_score;
    map[r.team_id].count++;
  });
  return Object.values(map)
    .map(m => ({ ...DB.getTeam(m.team_id), total_score: m.total, members: m.count }))
    .sort((a,b) => b.total_score - a.total_score);
};

/** Department analytics (simulates department_analytics VIEW) */
DB.deptAnalytics = () => {
  const depts = [...new Set(DB.students.map(s => s.department))];
  return depts.map(dept => {
    const studs = DB.students.filter(s => s.department === dept);
    const ids   = studs.map(s => s.student_id);
    const regs  = DB.registrations.filter(r => ids.includes(r.student_id) && ['Confirmed','Completed'].includes(r.status));
    const res   = DB.results.filter(r => ids.includes(r.student_id));
    const scores = res.map(r => r.final_score);
    return {
      department:    dept,
      total_students: studs.length,
      events_participated: new Set(regs.map(r => r.event_id)).size,
      total_score:   scores.reduce((a,b) => a+b, 0),
      avg_score:     scores.length ? +(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : 0,
      highest_score: scores.length ? Math.max(...scores) : 0,
    };
  }).sort((a,b) => b.total_score - a.total_score);
};

/** Certificate summary */
DB.certSummary = () => ({
  winner:        DB.certificates.filter(c => c.certificate_type === 'Winner').length,
  participation: DB.certificates.filter(c => c.certificate_type === 'Participation').length,
  none: DB.registrations.filter(r =>
    ['Completed'].includes(r.status) &&
    !DB.certificates.find(c => c.student_id === r.student_id && c.event_id === r.event_id)
  ).length,
});

/** Registration status breakdown */
DB.regStatus = () => {
  const total = DB.registrations.length;
  const team  = DB.registrations.filter(r => r.team_id != null).length;
  const pend  = DB.registrations.filter(r => r.attendance_status === 'Pending').length;
  return { total, registered: total - team - pend, team_formed: team, pending: pend };
};

/** Next auto-increment IDs */
DB.nextStudentId = () => Math.max(...DB.students.map(s => s.student_id)) + 1;
DB.nextEventId   = () => Math.max(...DB.events.map(e => e.event_id)) + 1;
DB.nextTeamId    = () => Math.max(...DB.teams.map(t => t.team_id)) + 1;
DB.nextRegId     = () => Math.max(...DB.registrations.map(r => r.reg_id)) + 1;
