// ============================================================
// app.js – Frontend logic for College Event Registration System
// ============================================================

// ── Navigation ─────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard:'Dashboard', events:'Events', registrations:'Registrations',
  teams:'Teams', participants:'Participants', results:'Results',
  certificates:'Certificates', leaderboard:'Leaderboard',
  analytics:'Event Analytics', users:'Users', settings:'Settings'
};

function navigate(page) {
  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.getElementById('topbar-title').textContent = PAGE_TITLES[page] || page;
  // Render page-specific content
  const renderers = {
    dashboard: renderDashboard, events: renderEventsTable,
    participants: renderStudentsTable, registrations: renderRegsTable,
    teams: renderTeamsTable, results: renderResultsTable,
    certificates: renderCertsTable, leaderboard: renderLeaderboard,
    analytics: renderAnalytics, users: renderUsers
  };
  if (renderers[page]) renderers[page]();
}

// ── Modals ──────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  // Populate selects
  if (id === 'modal-add-reg') {
    document.getElementById('new-reg-student-search').value = '';
    filterRegStudents();
    populateSelect('new-reg-event', DB.events, e => e.event_id, e => e.event_name);
  }
  if (id === 'modal-add-team') {
    populateSelect('new-team-event', DB.events, e => e.event_id, e => e.event_name);
    populateSelect('new-team-leader', DB.students, s => s.student_id, s => `${s.name} (${s.department})`);
  }
  if (id === 'modal-add-result') {
    populateSelect('new-res-event', DB.events, e => e.event_id, e => e.event_name);
    populateSelect('new-res-student', DB.students, s => s.student_id, s => `${s.name}`);
  }
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m =>
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); })
);

function populateSelect(id, arr, valFn, txtFn) {
  const sel = document.getElementById(id); sel.innerHTML = '';
  arr.forEach(item => { const o = document.createElement('option'); o.value = valFn(item); o.textContent = txtFn(item); sel.appendChild(o); });
}

function filterRegStudents() {
  const q = (document.getElementById('new-reg-student-search')?.value || '').toLowerCase();
  const filtered = DB.students.filter(s => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  populateSelect('new-reg-student', filtered, s => s.student_id, s => `${s.name} (${s.department})`);
}

// ── Toast ───────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const tc = document.getElementById('toast-container');
  const t  = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  t.innerHTML = `<span>${icons[type]||'ℹ️'}</span> ${msg}`;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Badge helpers ────────────────────────────────────────────
function statusBadge(s) {
  const map = { Registered:'blue', Confirmed:'green', Completed:'green',
                Cancelled:'red', Upcoming:'orange', Ongoing:'purple',
                Present:'green', Absent:'red', Pending:'gray',
                Active:'green', Inactive:'gray', Disbanded:'red',
                Winner:'purple', Participation:'blue', None:'gray',
                Generated:'gray', Printed:'orange', Distributed:'green' };
  return `<span class="badge badge-${map[s]||'gray'}">${s}</span>`;
}

function rankBadge(i) {
  if (i === 0) return `<span class="rank-badge rank-1">🥇</span>`;
  if (i === 1) return `<span class="rank-badge rank-2">🥈</span>`;
  if (i === 2) return `<span class="rank-badge rank-3">🥉</span>`;
  return `<span class="rank-badge rank-n">${i+1}</span>`;
}

// ── DASHBOARD ───────────────────────────────────────────────
function renderDashboard() {
  // Stats are now editable inputs – user sets their own values
  // We don't overwrite them so custom numbers are preserved

  // Upcoming events list
  const upcoming = DB.events.filter(e => e.event_status !== 'Completed').slice(0,4);
  const ul = document.getElementById('upcoming-events-list');
  ul.innerHTML = upcoming.map(e => {
    const d = new Date(e.event_date);
    const mon = d.toLocaleString('default',{month:'short'}).toUpperCase();
    const day = d.getDate();
    return `<div class="event-item">
      <div class="event-thumb">${e.emoji}</div>
      <div class="event-info">
        <div class="event-name">${e.event_name}</div>
        <div class="event-meta">
          <span>📍 ${e.venue}</span>
          <span>📅 ${e.event_date}</span>
        </div>
      </div>
      <div class="event-date"><div class="event-month">${mon}</div><div class="event-day">${day}</div></div>
      <button class="btn btn-primary btn-sm" onclick="navigate('registrations')">Register</button>
    </div>`;
  }).join('');

  // Mini leaderboard (event 1)
  const lb = DB.teamLeaderboard(1).slice(0,5);
  document.getElementById('dash-leaderboard').innerHTML =
    `<thead><tr><th>Rank</th><th>Team Name</th><th>Score</th></tr></thead><tbody>` +
    lb.map((t,i) => `<tr><td>${rankBadge(i)}</td><td>${t.team_name}</td><td><strong>${t.total_score}</strong></td></tr>`).join('') +
    `</tbody>`;

  // Donut chart
  const rs = DB.regStatus();
  const total = rs.total;
  const circ = 2 * Math.PI * 40;
  const regPct  = rs.registered / total;
  const teamPct = rs.team_formed / total;
  const pendPct = rs.pending / total;
  document.getElementById('donut-registered').setAttribute('stroke-dasharray', `${(regPct*circ).toFixed(1)} ${circ}`);
  document.getElementById('donut-team').setAttribute('stroke-dasharray',       `${(teamPct*circ).toFixed(1)} ${circ}`);
  document.getElementById('donut-team').setAttribute('stroke-dashoffset',      `-${(regPct*circ).toFixed(1)}`);
  document.getElementById('donut-pending').setAttribute('stroke-dasharray',    `${(pendPct*circ).toFixed(1)} ${circ}`);
  document.getElementById('donut-pending').setAttribute('stroke-dashoffset',   `-${((regPct+teamPct)*circ).toFixed(1)}`);
  document.getElementById('donut-total').textContent = total;
  document.getElementById('donut-legend').innerHTML = [
    { color:'#4361EE', label:'Registered',  val:`${rs.registered} (${(regPct*100).toFixed(1)}%)` },
    { color:'#06D6A0', label:'Team Formed', val:`${rs.team_formed} (${(teamPct*100).toFixed(1)}%)` },
    { color:'#FFB703', label:'Pending',     val:`${rs.pending} (${(pendPct*100).toFixed(1)}%)` },
  ].map(l => `<div class="legend-item"><div class="legend-dot" style="background:${l.color}"></div>
    <span class="legend-label">${l.label}</span><span class="legend-val">${l.val}</span></div>`).join('');

  // Cert summary
  const cs = DB.certSummary();
  document.getElementById('cert-summary-body').innerHTML = `
    <tr><td>Eligible for Winner Certificate</td><td><strong>${cs.winner}</strong></td></tr>
    <tr><td>Eligible for Participation Certificate</td><td><strong>${cs.participation}</strong></td></tr>
    <tr><td>Not Eligible</td><td><strong>${cs.none}</strong></td></tr>`;

  // Bar chart
  const evSummary = DB.participantsPerEvent();
  const maxP = Math.max(...evSummary.map(e => e.participants), 1);
  const colors = ['#4361EE','#06D6A0','#FFB703','#7209B7','#F72585'];
  document.getElementById('bar-chart').innerHTML = evSummary.map((e,i) =>
    `<div class="bar-col">
      <div class="bar" style="height:${Math.max((e.participants/maxP)*90,4)}px;background:${colors[i%colors.length]}"></div>
      <div class="bar-label">${e.event_name.split(' ')[0]}</div>
    </div>`).join('');
}

// ── EVENTS TABLE ────────────────────────────────────────────
function renderEventsTable() {
  const q   = (document.getElementById('event-search')?.value || '').toLowerCase();
  const typ = document.getElementById('event-type-filter')?.value || '';
  const sts = document.getElementById('event-status-filter')?.value || '';
  const evSummary = DB.participantsPerEvent();
  const rows = evSummary.filter(e =>
    (!q   || e.event_name.toLowerCase().includes(q)) &&
    (!typ || e.event_type === typ) &&
    (!sts || e.event_status === sts)
  );
  document.getElementById('events-tbody').innerHTML = rows.map((e,i) =>
    `<tr>
      <td>${i+1}</td>
      <td><strong>${e.emoji} ${e.event_name}</strong></td>
      <td>${statusBadge(e.event_type)}</td>
      <td>📍 ${e.venue}</td>
      <td>${e.event_date}</td>
      <td>${e.participants}/${e.max_participants}</td>
      <td>${statusBadge(e.event_status)}</td>
      <td><button class="btn btn-outline btn-sm">View</button></td>
    </tr>`).join('');
}

// ── STUDENTS TABLE ──────────────────────────────────────────
function renderStudentsTable() {
  const q    = (document.getElementById('student-search')?.value || '').toLowerCase();
  const dept = document.getElementById('dept-filter')?.value || '';
  const yr   = document.getElementById('year-filter')?.value || '';
  const rows = DB.students.filter(s =>
    (!q    || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
    (!dept || s.department === dept) &&
    (!yr   || String(s.year) === yr)
  );
  document.getElementById('students-tbody').innerHTML = rows.map(s => {
    const evCount = new Set(DB.registrations.filter(r => r.student_id === s.student_id).map(r => r.event_id)).size;
    return `<tr>
      <td>${s.student_id}</td>
      <td><strong>${s.name}</strong></td>
      <td>${s.email}</td>
      <td>${statusBadge(s.department)}</td>
      <td>Year ${s.year}</td>
      <td>${s.gender}</td>
      <td>${evCount} event${evCount!==1?'s':''}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.student_id})">Delete</button></td>
    </tr>`;
  }).join('');
}

// ── REGISTRATIONS TABLE ──────────────────────────────────────
function populateEventFilter(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const existing = sel.innerHTML;
  if (!existing.includes('<option value="1">')) {
    DB.events.forEach(e => {
      const o = document.createElement('option');
      o.value = e.event_id; o.textContent = e.event_name;
      sel.appendChild(o);
    });
  }
}

function renderRegsTable() {
  populateEventFilter('reg-event-filter');
  const q   = (document.getElementById('reg-search')?.value || '').toLowerCase();
  const evF = document.getElementById('reg-event-filter')?.value || '';
  const stF = document.getElementById('reg-status-filter')?.value || '';
  const rows = DB.registrations.filter(r =>
    (!evF || String(r.event_id) === evF) &&
    (!stF || r.status === stF) &&
    (!q   || (DB.getStudent(r.student_id)?.name || '').toLowerCase().includes(q))
  );
  document.getElementById('regs-tbody').innerHTML = rows.map(r => {
    const s = DB.getStudent(r.student_id);
    const e = DB.getEvent(r.event_id);
    const t = r.team_id ? DB.getTeam(r.team_id) : null;
    return `<tr>
      <td>${r.reg_id}</td>
      <td>${s?.name||'-'}</td>
      <td>${e?.event_name||'-'}</td>
      <td>${statusBadge(r.registration_type)}</td>
      <td>${t?.team_name||'—'}</td>
      <td>${statusBadge(r.status)}</td>
      <td>${statusBadge(r.attendance_status)}</td>
      <td>${new Date().toLocaleDateString()}</td>
    </tr>`;
  }).join('');
}

// ── TEAMS TABLE ─────────────────────────────────────────────
function renderTeamsTable() {
  populateEventFilter('team-event-filter');
  const q   = (document.getElementById('team-search')?.value || '').toLowerCase();
  const evF = document.getElementById('team-event-filter')?.value || '';
  const rows = DB.teams.filter(t =>
    (!q   || t.team_name.toLowerCase().includes(q)) &&
    (!evF || String(t.event_id) === evF)
  );
  document.getElementById('teams-tbody').innerHTML = rows.map(t => {
    const leader  = DB.getStudent(t.leader_id);
    const event   = DB.getEvent(t.event_id);
    const members = DB.team_members.filter(m => m.team_id === t.team_id);
    const mNames  = members.map(m => DB.getStudent(m.student_id)?.name||'').join(', ');
    return `<tr>
      <td>${t.team_id}</td>
      <td><strong>${t.team_name}</strong></td>
      <td>${event?.event_name||'-'}</td>
      <td>${leader?.name||'-'}</td>
      <td style="font-size:11px;color:#6B7280;">${mNames}</td>
      <td>${members.length}</td>
      <td>${statusBadge(t.status)}</td>
      <td><button class="btn btn-outline btn-sm">View</button></td>
    </tr>`;
  }).join('');
}

// ── RESULTS TABLE ────────────────────────────────────────────
function renderResultsTable() {
  populateEventFilter('result-event-filter');
  const evF = document.getElementById('result-event-filter')?.value || '';
  const rows = DB.results
    .filter(r => !evF || String(r.event_id) === evF)
    .sort((a,b) => b.final_score - a.final_score);
  document.getElementById('results-tbody').innerHTML = rows.map((r,i) => {
    const s = DB.getStudent(r.student_id);
    const e = DB.getEvent(r.event_id);
    const t = r.team_id ? DB.getTeam(r.team_id) : null;
    return `<tr>
      <td>${rankBadge(i)}</td>
      <td>${s?.name||'-'}</td>
      <td>${e?.event_name||'-'}</td>
      <td>${t?.team_name||'Individual'}</td>
      <td>${r.score}</td>
      <td style="color:#EF233C">-${r.penalty_points}</td>
      <td><strong>${r.final_score}</strong></td>
      <td>${r.completion_time||'—'}</td>
    </tr>`;
  }).join('');
}

// ── CERTIFICATES TABLE ───────────────────────────────────────
function renderCertsTable() {
  populateEventFilter('cert-event-filter');
  const evF  = document.getElementById('cert-event-filter')?.value || '';
  const typF = document.getElementById('cert-type-filter')?.value || '';
  const rows = DB.certificates.filter(c =>
    (!evF  || String(c.event_id) === evF) &&
    (!typF || c.certificate_type === typF)
  );
  document.getElementById('certs-tbody').innerHTML = rows.map(c => {
    const s = DB.getStudent(c.student_id);
    const e = DB.getEvent(c.event_id);
    return `<tr>
      <td style="font-size:11px">${c.certificate_number}</td>
      <td>${s?.name||'-'}</td>
      <td>${e?.event_name||'-'}</td>
      <td>${statusBadge(c.certificate_type)}</td>
      <td>${c.score_obtained}</td>
      <td>${c.rank_achieved}</td>
      <td>${c.issued_date}</td>
      <td>${statusBadge(c.status)}</td>
    </tr>`;
  }).join('');
}

// ── LEADERBOARD ──────────────────────────────────────────────
function renderLeaderboard() {
  const evId = parseInt(document.getElementById('lb-event-filter')?.value || 1);

  // Team leaderboard
  const teams = DB.teamLeaderboard(evId);
  document.getElementById('lb-team-tbody').innerHTML = teams.map((t,i) =>
    `<tr><td>${rankBadge(i)}</td><td><strong>${t.team_name}</strong></td>
     <td>${DB.getEvent(evId)?.event_name||'-'}</td><td>${t.total_score}</td></tr>`
  ).join('');

  // Individual
  const indResults = DB.results.filter(r => r.event_id === evId)
    .sort((a,b) => b.final_score - a.final_score);
  document.getElementById('lb-ind-tbody').innerHTML = indResults.map((r,i) => {
    const s = DB.getStudent(r.student_id);
    return `<tr><td>${rankBadge(i)}</td><td>${s?.name||'-'}</td>
      <td>${statusBadge(s?.department||'')}</td><td>${r.final_score}</td></tr>`;
  }).join('');
}

// ── ANALYTICS ───────────────────────────────────────────────
function renderAnalytics() {
  // Summary stats
  const evSummary = DB.participantsPerEvent();
  const totalP    = DB.totalParticipants();
  const allScores = DB.results.map(r => r.final_score);
  const avgScore  = allScores.length ? (allScores.reduce((a,b)=>a+b,0)/allScores.length).toFixed(1) : 0;
  document.getElementById('analytics-stats').innerHTML = `
    <div class="stat-card"><div class="stat-icon blue">📅</div><div><div class="stat-value">${DB.events.length}</div><div class="stat-label">Total Events</div></div></div>
    <div class="stat-card"><div class="stat-icon green">👥</div><div><div class="stat-value">${totalP}</div><div class="stat-label">Total Participants</div></div></div>
    <div class="stat-card"><div class="stat-icon orange">📊</div><div><div class="stat-value">${avgScore}</div><div class="stat-label">Avg Score</div></div></div>
    <div class="stat-card"><div class="stat-icon purple">📜</div><div><div class="stat-value">${DB.certificates.length}</div><div class="stat-label">Certificates</div></div></div>`;

  // Department table
  const depts = DB.deptAnalytics();
  document.getElementById('dept-tbody').innerHTML = depts.map(d =>
    `<tr><td><strong>${d.department}</strong></td><td>${d.total_students}</td>
     <td>${d.events_participated}</td><td>${d.avg_score}</td>
     <td>${d.total_score}</td><td>${d.highest_score}</td></tr>`
  ).join('');

  // Event summary
  document.getElementById('event-summary-tbody').innerHTML = evSummary.map(e =>
    `<tr><td><strong>${e.emoji} ${e.event_name}</strong></td>
     <td>${statusBadge(e.event_type)}</td>
     <td>${e.participants}</td><td>${e.teams}</td>
     <td>${statusBadge(e.event_status)}</td></tr>`
  ).join('');
}

// ── USERS ────────────────────────────────────────────────────
function renderUsers() {
  document.getElementById('staff-tbody').innerHTML = DB.staff.map(s =>
    `<tr><td>${s.staff_id}</td><td>${s.name}</td><td>${s.email}</td>
     <td>${statusBadge(s.role)}</td><td>${s.department}</td></tr>`
  ).join('');
}

// ── CRUD ACTIONS ─────────────────────────────────────────────
async function addEvent() {
  const name  = document.getElementById('new-event-name').value.trim();
  const type  = document.getElementById('new-event-type').value;
  const date  = document.getElementById('new-event-date').value;
  const venue = document.getElementById('new-event-venue').value.trim();
  const cap   = parseInt(document.getElementById('new-event-cap').value);
  const status= document.getElementById('new-event-status').value;
  const desc  = document.getElementById('new-event-desc').value;
  if (!name || !date || !venue) { toast('Fill all required fields','error'); return; }
  
  try {
    const emojis = { Hackathon:'🚀',CodeContest:'💻',Workshop:'🔧',Gaming:'🎮',Quiz:'❓',Presentation:'📄' };
    const result = await apiAddEvent({
      event_name: name,
      event_type: type,
      venue,
      event_date: date,
      max_participants: cap || 50,
      description: desc,
      event_status: status,
      organizer_id: 101
    });
    
    DB.events.push({
      ...result,
      emoji: emojis[type] || '🎯'
    });
    closeModal('modal-add-event');
    renderEventsTable();
    toast(`Event "${name}" created!`, 'success');
  } catch (err) {
    console.error(err);
    toast('Error creating event: ' + err.message, 'error');
  }
}

function addStudent() {
  const name  = document.getElementById('new-s-name').value.trim();
  const email = document.getElementById('new-s-email').value.trim();
  const dept  = document.getElementById('new-s-dept').value;
  const year  = parseInt(document.getElementById('new-s-year').value);
  const contact = document.getElementById('new-s-contact').value;
  const gender= document.getElementById('new-s-gender').value;
  if (!name || !email) { toast('Name and email required','error'); return; }
  if (DB.students.find(s => s.email === email)) { toast('Email already exists (UNIQUE constraint)','error'); return; }
  
  apiAddStudent({ name, email, contact_no:contact, department:dept, year, gender })
    .then(result => {
      DB.students.push(result);
      closeModal('modal-add-student');
      renderStudentsTable();
      toast(`Student "${name}" registered!`, 'success');
    })
    .catch(err => {
      console.error(err);
      toast('Error: ' + err.message, 'error');
    });
}

function deleteStudent(id) {
  const hasReg = DB.registrations.find(r => r.student_id === id);
  if (hasReg) { toast('Cannot delete – student has registrations (FK constraint)','error'); return; }
  const idx = DB.students.findIndex(s => s.student_id === id);
  if (idx !== -1) { 
    const name = DB.students[idx].name; 
    DB.students.splice(idx,1); 
    renderStudentsTable(); 
    toast(`Deleted "${name}"`, 'success'); 
  }
}

function addRegistration() {
  const sid = parseInt(document.getElementById('new-reg-student').value);
  const eid = parseInt(document.getElementById('new-reg-event').value);
  const type= document.getElementById('new-reg-type').value;
  if (DB.registrations.find(r => r.student_id === sid && r.event_id === eid)) {
    toast('Already registered! (UNIQUE constraint: student_id, event_id)', 'error'); return;
  }
  
  apiAddRegistration({ student_id: sid, event_id: eid, registration_type: type })
    .then(result => {
      DB.registrations.push({ 
        ...result,
        registration_type: type, 
        status:'Registered', 
        attendance_status:'Pending', 
        payment_status:'NA' 
      });
      closeModal('modal-add-reg');
      renderRegsTable();
      toast('Registration added!', 'success');
    })
    .catch(err => {
      console.error(err);
      toast('Error: ' + err.message, 'error');
    });
}

function addTeam() {
  const name  = document.getElementById('new-team-name').value.trim();
  const eid   = parseInt(document.getElementById('new-team-event').value);
  const lid   = parseInt(document.getElementById('new-team-leader').value);
  if (!name) { toast('Team name required', 'error'); return; }
  if (DB.teams.find(t => t.team_name === name && t.event_id === eid)) {
    toast('Team name already exists for this event (UNIQUE constraint)','error'); return;
  }
  
  apiAddTeam({ team_name: name, event_id: eid, leader_id: lid, team_size: 1 })
    .then(result => {
      const tid = result.id;
      DB.teams.push({ 
        team_id: tid, 
        team_name: name, 
        event_id: eid, 
        leader_id: lid, 
        team_size: 1, 
        status:'Active' 
      });
      DB.team_members.push({ 
        member_id: DB.team_members.length + 1, 
        team_id: tid, 
        student_id: lid, 
        role:'Leader' 
      });
      closeModal('modal-add-team');
      renderTeamsTable();
      toast(`Team "${name}" created!`, 'success');
    })
    .catch(err => {
      console.error(err);
      toast('Error: ' + err.message, 'error');
    });
}

function addResult() {
  const eid     = parseInt(document.getElementById('new-res-event').value);
  const sid     = parseInt(document.getElementById('new-res-student').value);
  const score   = parseInt(document.getElementById('new-res-score').value);
  const penalty = parseInt(document.getElementById('new-res-penalty').value) || 0;
  const rank    = parseInt(document.getElementById('new-res-rank').value) || null;
  const time    = parseInt(document.getElementById('new-res-time').value) || null;
  if (isNaN(score)) { toast('Score required', 'error'); return; }
  
  apiAddResult({ 
    student_id: sid, 
    event_id: eid, 
    score: score,
    penalty_points: penalty,
    rank_position: rank,
    completion_time: time,
    final_score: score - penalty
  })
    .then(result => {
      DB.results.push({ 
        result_id: DB.results.length + 1, 
        team_id: null, 
        student_id: sid, 
        event_id: eid,
        score, 
        rank_position: rank, 
        completion_time: time, 
        penalty_points: penalty, 
        final_score: score - penalty 
      });
      closeModal('modal-add-result');
      renderResultsTable();
      toast('Result submitted!', 'success');
    })
    .catch(err => {
      console.error(err);
      toast('Error: ' + err.message, 'error');
    });
}

// ── Init ─────────────────────────────────────────────────────
// (Initialization moved to index.html to load from MySQL APIs)
