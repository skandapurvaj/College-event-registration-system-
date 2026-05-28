// ============================================================
// server.js – Express Backend with MySQL Connection (Fallback to Mock DB)
// ============================================================

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// MySQL Connection Pool (with error handling)
let pool = null;
let usesMysql = true;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('ℹ️  MySQL pool created. Testing connection...');
} catch (err) {
  console.error('✗ MySQL pool error:', err.message);
  usesMysql = false;
}

// Generate random students
function generateStudents(count) {
  const firstNames = ['Rahul', 'Priya', 'Aditya', 'Neha', 'Varun', 'Anjali', 'Arjun', 'Divya', 'Nikhil', 'Sakshi', 'Rohan', 'Isha', 'Harsh', 'Pooja', 'Karan', 'Meera', 'Ashok', 'Shruti', 'Vikram', 'Nisha'];
  const lastNames = ['Kumar', 'Singh', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Rao', 'Nair', 'Desai', 'Khanna', 'Malhotra', 'Chopra', 'Dubey', 'Joshi', 'Pandey'];
  const departments = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'];
  const students = [];
  
  for (let i = 1; i <= count; i++) {
    const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
    const dept = departments[Math.floor(Math.random() * departments.length)];
    students.push({
      student_id: i,
      name: `${fname} ${lname}`,
      email: `student${i}@college.com`,
      contact_no: `98${Math.floor(Math.random() * 1000000000).toString().padStart(8, '0')}`,
      department: dept,
      year: Math.floor(Math.random() * 4) + 1,
      gender: Math.random() > 0.5 ? 'Male' : 'Female'
    });
  }
  return students;
}

// Generate random teams, registrations, and results
function generateMockData(studentCount, eventCount, teamCount) {
  const data = {
    teams: [],
    team_members: [],
    registrations: [],
    results: [],
    certificates: []
  };
  
  // Create Teams
  const teamNames = ['Code Warriors','Bug Avengers','Syntax Squad','Null Pointers','Algo Titans',
    'Debug Dragons','Binary Blazers','Cyber Wolves','Tech Ninjas','Data Dynamos',
    'Pixel Pirates','Cloud Crusaders','Logic Lords','Quantum Coders','Stack Smashers',
    'Bit Busters','Neural Knights','Hash Hawks','Script Savants','Compile Kings'];
  for (let i = 1; i <= teamCount; i++) {
    const eventId = (i % eventCount) + 1;
    const leaderId = Math.floor(Math.random() * studentCount) + 1;
    const teamSize = Math.floor(Math.random() * 3) + 2; // 2-4 members
    
    data.teams.push({
      team_id: i,
      team_name: teamNames[(i - 1) % teamNames.length],
      event_id: eventId,
      leader_id: leaderId,
      team_size: teamSize,
      status: 'Active'
    });
    
    // Add leader to team members
    data.team_members.push({ member_id: data.team_members.length + 1, team_id: i, student_id: leaderId, role: 'Leader' });
    
    // Add other members
    const members = new Set([leaderId]);
    while(members.size < teamSize) {
      const mId = Math.floor(Math.random() * studentCount) + 1;
      if (!members.has(mId)) {
        members.add(mId);
        data.team_members.push({ member_id: data.team_members.length + 1, team_id: i, student_id: mId, role: 'Member' });
      }
    }
    
    // Add registrations for this team
    members.forEach(mId => {
      data.registrations.push({
        reg_id: data.registrations.length + 1,
        student_id: mId,
        event_id: eventId,
        team_id: i,
        registration_type: 'Team',
        registration_date: new Date(),
        status: 'Registered',
        attendance_status: 'Present',
        payment_status: 'Paid'
      });
    });
    
    // Add result for team
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    data.results.push({
      result_id: data.results.length + 1,
      team_id: i,
      student_id: leaderId, // Map to leader for simplicity
      event_id: eventId,
      score: score,
      penalty_points: 0,
      rank_position: Math.floor(Math.random() * 5) + 1,
      completion_time: 120,
      final_score: score
    });
  }
  
  return data;
}

const generatedMock = generateMockData(75, 5, 17);
const mockData = {
  staff: [
    { staff_id:101, name:'Dr. A. Sharma',  email:'sharma@college.edu', role:'HOD',         department:'CSE'  },
    { staff_id:102, name:'Prof. R. Verma', email:'verma@college.edu',  role:'Organizer',   department:'ECE'  },
    { staff_id:103, name:'Prof. S. Kulkarni', email:'kulkarni@college.edu', role:'Organizer', department:'ME' },
  ],
  students: generateStudents(75),
  events: [
    { event_id:1, event_name:'Smart India Hackathon 2024', event_type:'Hackathon', venue:'Lab A', event_date:'2024-05-20', max_participants:100, event_status:'Completed' },
    { event_id:2, event_name:'CodeQuest Programming Contest', event_type:'CodeContest', venue:'Hall B', event_date:'2024-05-25', max_participants:150, event_status:'Completed' },
    { event_id:3, event_name:'AI & ML Web Dev Workshop', event_type:'Workshop', venue:'Lab C', event_date:'2024-06-01', max_participants:80, event_status:'Upcoming' },
    { event_id:4, event_name:'Esports Gaming Tournament', event_type:'Gaming', venue:'Auditorium', event_date:'2024-06-05', max_participants:120, event_status:'Upcoming' },
    { event_id:5, event_name:'Tech Startup Presentation', event_type:'Presentation', venue:'Hall D', event_date:'2024-06-10', max_participants:60, event_status:'Upcoming' }
  ],
  teams: generatedMock.teams,
  team_members: generatedMock.team_members,
  registrations: generatedMock.registrations,
  results: generatedMock.results,
  certificates: []
};

// ============================================================
// API ENDPOINTS
// ============================================================

// Helper function to query database
async function queryDatabase(sql, params = []) {
  if (!usesMysql || !pool) {
    throw new Error('MySQL not available');
  }
  const connection = await pool.getConnection();
  const [rows] = await connection.query(sql, params);
  connection.release();
  return rows;
}

// GET all staff
app.get('/api/staff', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM staff');
    res.json(rows);
  } catch (err) {
    console.log('Using mock data for staff');
    res.json(mockData.staff);
  }
});

// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    console.log('Using mock data for students');
    res.json(mockData.students);
  }
});

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM events');
    res.json(rows);
  } catch (err) {
    console.log('Using mock data for events');
    res.json(mockData.events);
  }
});

// GET all teams
app.get('/api/teams', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM teams');
    res.json(rows);
  } catch (err) {
    console.log('Using mock data for teams');
    res.json(mockData.teams);
  }
});

// GET all team members
app.get('/api/team_members', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM team_members');
    res.json(rows);
  } catch (err) {
    console.log('Using mock data for team_members');
    res.json(mockData.team_members);
  }
});

// GET all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM registrations');
    res.json(rows);
  } catch (err) {
    console.log('Using mock data for registrations');
    res.json(mockData.registrations);
  }
});

// GET all results
app.get('/api/results', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM results');
    res.json(rows);
  } catch (err) {
    console.log('Using mock data for results');
    res.json(mockData.results);
  }
});

// GET all certificates
app.get('/api/certificates', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM certificates');
    res.json(rows);
  } catch (err) {
    console.log('Using mock data for certificates');
    res.json(mockData.certificates);
  }
});

// ADD new student
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, contact_no, department, year, gender } = req.body;
    const result = await queryDatabase(
      'INSERT INTO students (name, email, contact_no, department, year, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, contact_no, department, year, gender]
    );
    res.json({ student_id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ADD new event
app.post('/api/events', async (req, res) => {
  try {
    const { event_name, event_type, venue, event_date, start_time, end_time, max_participants, min_team_size, max_team_size, description, organizer_id } = req.body;
    const result = await queryDatabase(
      'INSERT INTO events (event_name, event_type, venue, event_date, start_time, end_time, max_participants, min_team_size, max_team_size, description, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [event_name, event_type, venue, event_date, start_time, end_time, max_participants, min_team_size, max_team_size, description, organizer_id]
    );
    res.json({ event_id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ADD new team
app.post('/api/teams', async (req, res) => {
  try {
    const { team_name, event_id, leader_id, team_size } = req.body;
    const result = await queryDatabase(
      'INSERT INTO teams (team_name, event_id, leader_id, team_size) VALUES (?, ?, ?, ?)',
      [team_name, event_id, leader_id, team_size]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ADD registration
app.post('/api/registrations', async (req, res) => {
  try {
    const { student_id, event_id, registration_type } = req.body;
    const result = await queryDatabase(
      'INSERT INTO registrations (student_id, event_id, registration_type) VALUES (?, ?, ?)',
      [student_id, event_id, registration_type]
    );
    res.json({ id: result.insertId, student_id, event_id, registration_type });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ADD result
app.post('/api/results', async (req, res) => {
  try {
    const { student_id, event_id, score, penalty_points, rank_position, completion_time, final_score } = req.body;
    const result = await queryDatabase(
      'INSERT INTO results (student_id, event_id, score, penalty_points, rank_position, completion_time) VALUES (?, ?, ?, ?, ?, ?)',
      [student_id, event_id, score, penalty_points, rank_position, completion_time]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { event_status } = req.body;
    await queryDatabase('UPDATE events SET event_status = ? WHERE event_id = ?', [event_status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await queryDatabase('DELETE FROM events WHERE event_id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Server startup with port fallback
const DEFAULT_PORT = 3000;
const PORT = parseInt(process.env.SERVER_PORT) || DEFAULT_PORT;
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n✓ Server running on http://localhost:${port}`);
    if (usesMysql && pool) {
      console.log(`✓ Database: ${process.env.DB_NAME} (${process.env.DB_HOST})`);
    } else {
      console.log(`⚠️  Using mock database (MySQL not available)`);
      console.log(`   To enable MySQL:`);
      console.log(`   1. Update .env with correct MySQL credentials`);
      console.log(`   2. Run: node db-init-simple.js`);
      console.log(`   3. Restart the server`);
    }
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const newPort = port + 1;
      console.warn(`⚠️  Port ${port} in use, trying ${newPort}`);
      startServer(newPort);
    } else {
      console.error('Server error:', err);
    }
  });
};
// Initiate server start
startServer(PORT);
