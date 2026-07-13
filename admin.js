/* ============================================================
   SDRRS — admin.js
   Demo-only client-side login gate + dashboard rendering.
   NOTE: This is a front-end demo. In production, authenticate
   against a real backend — never ship a hardcoded password.
   ============================================================ */

const ADMIN_DEMO_PASSWORD = 'SDRRS2.0';

document.addEventListener('DOMContentLoaded', () => {
  const loginView = document.getElementById('loginView');
  const dashView = document.getElementById('dashView');
  const loginBtn = document.getElementById('loginBtn');
  const adminPass = document.getElementById('adminPass');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  function showDashboard(){
    loginView.style.display = 'none';
    dashView.style.display = 'block';
    logoutBtn.style.display = 'inline-flex';
    renderDashboard();
  }
  function showLogin(){
    dashView.style.display = 'none';
    loginView.style.display = 'block';
    logoutBtn.style.display = 'none';
  }

  loginBtn.addEventListener('click', attemptLogin);
  adminPass.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptLogin(); });

  function attemptLogin(){
    if (adminPass.value === ADMIN_DEMO_PASSWORD){
      sessionStorage.setItem(SDRRS_KEYS.ADMIN_SESSION, 'true');
      loginError.style.display = 'none';
      showDashboard();
    }else{
      loginError.style.display = 'block';
    }
  }

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(SDRRS_KEYS.ADMIN_SESSION);
    adminPass.value = '';
    showLogin();
  });

  if (sessionStorage.getItem(SDRRS_KEYS.ADMIN_SESSION) === 'true'){
    showDashboard();
  }

  /* -------------------- dashboard rendering -------------------- */
  let statusFilterValue = 'all';

  function timeAgo(ts){
    const mins = Math.round((Date.now() - ts) / 60000);
    if (mins < 60) return mins + ' min ago';
    const hrs = Math.round(mins/60);
    if (hrs < 24) return hrs + ' hr ago';
    return Math.round(hrs/24) + ' day(s) ago';
  }

  function statusBadge(status){
    const map = { pending:'Pending', progress:'In progress', resolved:'Resolved' };
    return `<span class="badge ${status}">${map[status] || status}</span>`;
  }
  function severityBadge(sev){
    return `<span class="badge ${sev}">${sev.toUpperCase()}</span>`;
  }

  function renderStats(reports, volunteers){
    document.getElementById('dTotal').textContent = reports.length;
    document.getElementById('dUrgent').textContent = reports.filter(r => r.urgent && r.status !== 'resolved').length;
    document.getElementById('dResolved').textContent = reports.filter(r => r.status === 'resolved').length;
    document.getElementById('dVolunteers').textContent = volunteers.length;
  }

  function renderReportsTable(reports){
    const filtered = statusFilterValue === 'all' ? reports : reports.filter(r => r.status === statusFilterValue);
    const tbody = document.getElementById('reportsTableBody');

    if (filtered.length === 0){
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:30px;color:var(--text-muted);">No reports match this filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => `
      <tr>
        <td class="mono">${r.id}</td>
        <td>${r.type} ${r.urgent ? '<span class="badge urgent">URGENT</span>' : ''}</td>
        <td>${severityBadge(r.severity)}</td>
        <td>${timeAgo(r.createdAt)}</td>
        <td>
          <select class="status-select" data-id="${r.id}">
            <option value="pending" ${r.status==='pending'?'selected':''}>Pending</option>
            <option value="progress" ${r.status==='progress'?'selected':''}>In progress</option>
            <option value="resolved" ${r.status==='resolved'?'selected':''}>Resolved</option>
          </select>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const reports = sdrrsGet(SDRRS_KEYS.REPORTS);
        const idx = reports.findIndex(r => r.id === sel.dataset.id);
        if (idx > -1){
          reports[idx].status = sel.value;
          sdrrsSet(SDRRS_KEYS.REPORTS, reports);
          showToast('Status updated', `${sel.dataset.id} marked as ${sel.value}.`, '✓');
          renderDashboard();
        }
      });
    });
  }

  function renderVolunteersTable(volunteers){
    const tbody = document.getElementById('adminVolunteersBody');
    if (volunteers.length === 0){
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:30px;color:var(--text-muted);">No volunteers yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = volunteers.map(v => `
      <tr>
        <td>${v.name}</td>
        <td class="mono">${v.phone}</td>
        <td>${v.location}</td>
        <td>${v.skills.join(', ')}</td>
        <td>${v.availability}</td>
      </tr>
    `).join('');
  }

  function renderChart(reports){
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 220 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0,0,rect.width,220);

    const counts = {};
    reports.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
    const labels = Object.keys(counts);
    const values = Object.values(counts);
    const max = Math.max(...values, 1);

    const padding = 30;
    const chartW = rect.width - padding*2;
    const chartH = 220 - padding*2;
    const barW = chartW / labels.length * 0.55;
    const gap = chartW / labels.length;

    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = '#8b93a7';

    labels.forEach((label, i) => {
      const x = padding + i*gap + (gap - barW)/2;
      const h = (values[i] / max) * chartH;
      const y = padding + (chartH - h);

      const grad = ctx.createLinearGradient(0, y, 0, y+h);
      grad.addColorStop(0, '#2fd0ff');
      grad.addColorStop(1, '#123a52');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, h, 6);
      ctx.fill();

      ctx.fillStyle = '#eef2f8';
      ctx.textAlign = 'center';
      ctx.fillText(values[i], x + barW/2, y - 8);

      ctx.fillStyle = '#8b93a7';
      const shortLabel = label.length > 10 ? label.slice(0,9)+'…' : label;
      ctx.fillText(shortLabel, x + barW/2, padding + chartH + 16);
    });

    if (labels.length === 0){
      ctx.fillStyle = '#8b93a7';
      ctx.textAlign = 'center';
      ctx.fillText('No report data yet', rect.width/2, 110);
    }
  }

  document.getElementById('statusFilter').addEventListener('change', (e) => {
    statusFilterValue = e.target.value;
    renderReportsTable(sdrrsGet(SDRRS_KEYS.REPORTS));
  });

  document.getElementById('clearReportsBtn').addEventListener('click', () => {
    if (confirm('Clear all reports? This cannot be undone.')){
      sdrrsSet(SDRRS_KEYS.REPORTS, []);
      renderDashboard();
      showToast('Reports cleared', 'All reports have been removed.', '🗑️');
    }
  });

  function renderDashboard(){
    const reports = sdrrsGet(SDRRS_KEYS.REPORTS).slice().sort((a,b) => b.createdAt - a.createdAt);
    const volunteers = sdrrsGet(SDRRS_KEYS.VOLUNTEERS).slice().sort((a,b) => b.createdAt - a.createdAt);
    renderStats(reports, volunteers);
    renderReportsTable(reports);
    renderVolunteersTable(volunteers);
    renderChart(reports);
  }

  window.addEventListener('resize', () => {
    if (dashView.style.display !== 'none') renderChart(sdrrsGet(SDRRS_KEYS.REPORTS));
  });
});
