"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* ============================================================
   SDRRS — admin.js
   Demo-only client-side login gate + dashboard rendering.
   NOTE: This is a front-end demo. In production, authenticate
   against a real backend — never ship a hardcoded password.
   ============================================================ */
var ADMIN_DEMO_PASSWORD = 'admin123';
document.addEventListener('DOMContentLoaded', function () {
  var loginView = document.getElementById('loginView');
  var dashView = document.getElementById('dashView');
  var loginBtn = document.getElementById('loginBtn');
  var adminPass = document.getElementById('adminPass');
  var loginError = document.getElementById('loginError');
  var logoutBtn = document.getElementById('logoutBtn');

  function showDashboard() {
    loginView.style.display = 'none';
    dashView.style.display = 'block';
    logoutBtn.style.display = 'inline-flex';
    renderDashboard();
  }

  function showLogin() {
    dashView.style.display = 'none';
    loginView.style.display = 'block';
    logoutBtn.style.display = 'none';
  }

  loginBtn.addEventListener('click', attemptLogin);
  adminPass.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') attemptLogin();
  });

  function attemptLogin() {
    if (adminPass.value === ADMIN_DEMO_PASSWORD) {
      sessionStorage.setItem(SDRRS_KEYS.ADMIN_SESSION, 'true');
      loginError.style.display = 'none';
      showDashboard();
    } else {
      loginError.style.display = 'block';
    }
  }

  logoutBtn.addEventListener('click', function () {
    sessionStorage.removeItem(SDRRS_KEYS.ADMIN_SESSION);
    adminPass.value = '';
    showLogin();
  });

  if (sessionStorage.getItem(SDRRS_KEYS.ADMIN_SESSION) === 'true') {
    showDashboard();
  }
  /* -------------------- dashboard rendering -------------------- */


  var statusFilterValue = 'all';

  function timeAgo(ts) {
    var mins = Math.round((Date.now() - ts) / 60000);
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + ' hr ago';
    return Math.round(hrs / 24) + ' day(s) ago';
  }

  function statusBadge(status) {
    var map = {
      pending: 'Pending',
      progress: 'In progress',
      resolved: 'Resolved'
    };
    return "<span class=\"badge ".concat(status, "\">").concat(map[status] || status, "</span>");
  }

  function severityBadge(sev) {
    return "<span class=\"badge ".concat(sev, "\">").concat(sev.toUpperCase(), "</span>");
  }

  function renderStats(reports, volunteers) {
    document.getElementById('dTotal').textContent = reports.length;
    document.getElementById('dUrgent').textContent = reports.filter(function (r) {
      return r.urgent && r.status !== 'resolved';
    }).length;
    document.getElementById('dResolved').textContent = reports.filter(function (r) {
      return r.status === 'resolved';
    }).length;
    document.getElementById('dVolunteers').textContent = volunteers.length;
  }

  function renderReportsTable(reports) {
    var filtered = statusFilterValue === 'all' ? reports : reports.filter(function (r) {
      return r.status === statusFilterValue;
    });
    var tbody = document.getElementById('reportsTableBody');

    if (filtered.length === 0) {
      tbody.innerHTML = "<tr><td colspan=\"5\" class=\"text-center\" style=\"padding:30px;color:var(--text-muted);\">No reports match this filter.</td></tr>";
      return;
    }

    tbody.innerHTML = filtered.map(function (r) {
      return "\n      <tr>\n        <td class=\"mono\">".concat(r.id, "</td>\n        <td>").concat(r.type, " ").concat(r.urgent ? '<span class="badge urgent">URGENT</span>' : '', "</td>\n        <td>").concat(severityBadge(r.severity), "</td>\n        <td>").concat(timeAgo(r.createdAt), "</td>\n        <td>\n          <select class=\"status-select\" data-id=\"").concat(r.id, "\">\n            <option value=\"pending\" ").concat(r.status === 'pending' ? 'selected' : '', ">Pending</option>\n            <option value=\"progress\" ").concat(r.status === 'progress' ? 'selected' : '', ">In progress</option>\n            <option value=\"resolved\" ").concat(r.status === 'resolved' ? 'selected' : '', ">Resolved</option>\n          </select>\n        </td>\n      </tr>\n    ");
    }).join('');
    tbody.querySelectorAll('.status-select').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var reports = sdrrsGet(SDRRS_KEYS.REPORTS);
        var idx = reports.findIndex(function (r) {
          return r.id === sel.dataset.id;
        });

        if (idx > -1) {
          reports[idx].status = sel.value;
          sdrrsSet(SDRRS_KEYS.REPORTS, reports);
          showToast('Status updated', "".concat(sel.dataset.id, " marked as ").concat(sel.value, "."), '✓');
          renderDashboard();
        }
      });
    });
  }

  function renderVolunteersTable(volunteers) {
    var tbody = document.getElementById('adminVolunteersBody');

    if (volunteers.length === 0) {
      tbody.innerHTML = "<tr><td colspan=\"5\" class=\"text-center\" style=\"padding:30px;color:var(--text-muted);\">No volunteers yet.</td></tr>";
      return;
    }

    tbody.innerHTML = volunteers.map(function (v) {
      return "\n      <tr>\n        <td>".concat(v.name, "</td>\n        <td class=\"mono\">").concat(v.phone, "</td>\n        <td>").concat(v.location, "</td>\n        <td>").concat(v.skills.join(', '), "</td>\n        <td>").concat(v.availability, "</td>\n      </tr>\n    ");
    }).join('');
  }

  function renderChart(reports) {
    var canvas = document.getElementById('chartCanvas');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 220 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, 220);
    var counts = {};
    reports.forEach(function (r) {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    var labels = Object.keys(counts);
    var values = Object.values(counts);
    var max = Math.max.apply(Math, _toConsumableArray(values).concat([1]));
    var padding = 30;
    var chartW = rect.width - padding * 2;
    var chartH = 220 - padding * 2;
    var barW = chartW / labels.length * 0.55;
    var gap = chartW / labels.length;
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = '#8b93a7';
    labels.forEach(function (label, i) {
      var x = padding + i * gap + (gap - barW) / 2;
      var h = values[i] / max * chartH;
      var y = padding + (chartH - h);
      var grad = ctx.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, '#2fd0ff');
      grad.addColorStop(1, '#123a52');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, h, 6);
      ctx.fill();
      ctx.fillStyle = '#eef2f8';
      ctx.textAlign = 'center';
      ctx.fillText(values[i], x + barW / 2, y - 8);
      ctx.fillStyle = '#8b93a7';
      var shortLabel = label.length > 10 ? label.slice(0, 9) + '…' : label;
      ctx.fillText(shortLabel, x + barW / 2, padding + chartH + 16);
    });

    if (labels.length === 0) {
      ctx.fillStyle = '#8b93a7';
      ctx.textAlign = 'center';
      ctx.fillText('No report data yet', rect.width / 2, 110);
    }
  }

  document.getElementById('statusFilter').addEventListener('change', function (e) {
    statusFilterValue = e.target.value;
    renderReportsTable(sdrrsGet(SDRRS_KEYS.REPORTS));
  });
  document.getElementById('clearReportsBtn').addEventListener('click', function () {
    if (confirm('Clear all reports? This cannot be undone.')) {
      sdrrsSet(SDRRS_KEYS.REPORTS, []);
      renderDashboard();
      showToast('Reports cleared', 'All reports have been removed.', '🗑️');
    }
  });

  function renderDashboard() {
    var reports = sdrrsGet(SDRRS_KEYS.REPORTS).slice().sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
    var volunteers = sdrrsGet(SDRRS_KEYS.VOLUNTEERS).slice().sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
    renderStats(reports, volunteers);
    renderReportsTable(reports);
    renderVolunteersTable(volunteers);
    renderChart(reports);
  }

  window.addEventListener('resize', function () {
    if (dashView.style.display !== 'none') renderChart(sdrrsGet(SDRRS_KEYS.REPORTS));
  });
});
//# sourceMappingURL=admin.dev.js.map
