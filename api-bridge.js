// ============================================================
// api-bridge.js – Load mock DB object from MySQL APIs
// ============================================================

const API_BASE = '/api';

async function loadDatabaseFromAPIs() {
  try {
    console.log('Loading data from MySQL APIs...');
    
    // Load all data in parallel
    const [staff, students, events, teams, team_members, registrations, results, certificates] = await Promise.all([
      fetch(`${API_BASE}/staff`).then(r => r.json()),
      fetch(`${API_BASE}/students`).then(r => r.json()),
      fetch(`${API_BASE}/events`).then(r => r.json()),
      fetch(`${API_BASE}/teams`).then(r => r.json()),
      fetch(`${API_BASE}/team_members`).then(r => r.json()),
      fetch(`${API_BASE}/registrations`).then(r => r.json()),
      fetch(`${API_BASE}/results`).then(r => r.json()),
      fetch(`${API_BASE}/certificates`).then(r => r.json())
    ]);

    // Populate DB object (same structure as db.js)
    DB.staff = staff;
    DB.students = students;
    DB.events = events.map(e => ({
      ...e,
      emoji: getEventEmoji(e.event_type)
    }));
    DB.teams = teams;
    DB.team_members = team_members;
    DB.registrations = registrations;
    DB.results = results;
    DB.certificates = certificates;

    console.log('✓ Data loaded successfully');
    return true;
  } catch (err) {
    console.error('✗ Failed to load data from APIs:', err);
    // Fallback to mock data if APIs fail
    console.warn('Falling back to mock database...');
    return false;
  }
}

function getEventEmoji(type) {
  const map = { 
    Hackathon: '🚀', 
    CodeContest: '💻', 
    Workshop: '🔧', 
    Gaming: '🎮', 
    Quiz: '❓', 
    Presentation: '📄' 
  };
  return map[type] || '🎯';
}

// API POST/PUT/DELETE helpers with robust error propagation
async function apiAddStudent(data) {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add student');
  return json;
}

async function apiAddEvent(data) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add event');
  return json;
}

async function apiAddTeam(data) {
  const res = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create team');
  return json;
}

async function apiAddRegistration(data) {
  const res = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add registration');
  return json;
}

async function apiAddResult(data) {
  const res = await fetch(`${API_BASE}/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit result');
  return json;
}

async function apiDeleteEvent(id) {
  await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' });
}

// Mock DB structure for fallback
const DB = {
  staff: [],
  students: [],
  events: [],
  teams: [],
  team_members: [],
  registrations: [],
  results: [],
  certificates: [],
  
  nextEventId() { return this.events.length ? Math.max(...this.events.map(e => e.event_id || 0)) + 1 : 1; },
  nextStudentId() { return this.students.length ? Math.max(...this.students.map(s => s.student_id || 0)) + 1 : 1; },
  nextTeamId() { return this.teams.length ? Math.max(...this.teams.map(t => t.team_id || 0)) + 1 : 1; },
  nextRegId() { return this.registrations.length ? Math.max(...this.registrations.map(r => r.reg_id || 0)) + 1 : 1; },
  
  getStudent(id) { return this.students.find(s => s.student_id === id); },
  getEvent(id) { return this.events.find(e => e.event_id === id); },
  getTeam(id) { return this.teams.find(t => t.team_id === id); },
  
  teamLeaderboard(eventId) {
    const eventTeams = this.teams.filter(t => t.event_id === eventId);
    return eventTeams.map(t => {
      const scores = this.results.filter(r => r.team_id === t.team_id).map(r => r.final_score || 0);
      return { ...t, total_score: scores.reduce((a,b) => a+b, 0) };
    }).sort((a,b) => b.total_score - a.total_score);
  },
  
  regStatus() {
    return {
      total: this.registrations.length,
      registered: this.registrations.filter(r => r.status === 'Registered').length,
      team_formed: this.team_members.length,
      pending: this.registrations.filter(r => r.status === 'Pending').length
    };
  },
  
  certSummary() {
    return {
      winner: this.certificates.filter(c => c.certificate_type === 'Winner').length,
      participation: this.certificates.filter(c => c.certificate_type === 'Participation').length,
      none: this.students.length - this.certificates.length
    };
  },
  
  participantsPerEvent() {
    return this.events.map(e => {
      const regs = this.registrations.filter(r => r.event_id === e.event_id).length;
      const teamCount = this.teams.filter(t => t.event_id === e.event_id).length;
      return { ...e, participants: regs, teams: teamCount };
    });
  },
  
  totalParticipants() {
    return new Set(this.registrations.map(r => r.student_id)).size;
  },
  
  deptAnalytics() {
    const depts = [...new Set(this.students.map(s => s.department))];
    return depts.map(dept => {
      const deptStds = this.students.filter(s => s.department === dept);
      const participatedStds = new Set(
        this.registrations
          .filter(r => deptStds.some(s => s.student_id === r.student_id))
          .map(r => r.student_id)
      );
      const scores = this.results.filter(r => participatedStds.has(r.student_id)).map(r => r.final_score || 0);
      return {
        department: dept,
        total_students: deptStds.length,
        events_participated: participatedStds.size,
        avg_score: scores.length ? (scores.reduce((a,b) => a+b, 0) / scores.length).toFixed(1) : 0,
        total_score: scores.reduce((a,b) => a+b, 0),
        highest_score: scores.length ? Math.max(...scores) : 0
      };
    });
  }
};
