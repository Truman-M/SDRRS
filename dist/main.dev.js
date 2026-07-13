"use strict";

/* ============================================================
   SDRRS — main.js
   Shared across every page: nav, tilt cards, storage, toast,
   the floating SOS button + modal, geolocation helper.
   ============================================================ */

/* ---------------------- Storage keys & helpers ---------------------- */
var SDRRS_KEYS = {
  REPORTS: 'sdrrs_reports',
  VOLUNTEERS: 'sdrrs_volunteers',
  ADMIN_SESSION: 'sdrrs_admin_session'
};

function sdrrsGet(key) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('SDRRS storage read error', e);
    return [];
  }
}

function sdrrsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('SDRRS storage write error', e);
    return false;
  }
}

function sdrrsId(prefix) {
  return prefix + '-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.floor(Math.random() * 90 + 10);
}

function sdrrsSeedIfEmpty() {
  if (sdrrsGet(SDRRS_KEYS.REPORTS).length === 0) {
    var now = Date.now();
    var seed = [{
      id: sdrrsId('RPT'),
      type: 'Flood',
      severity: 'high',
      desc: 'Rising water levels near the riverside market, several homes surrounded.',
      lat: 5.6037,
      lng: -0.1870,
      status: 'pending',
      urgent: true,
      createdAt: now - 1000 * 60 * 40
    }, {
      id: sdrrsId('RPT'),
      type: 'Fire',
      severity: 'high',
      desc: 'Warehouse fire spreading toward nearby residential block.',
      lat: 5.5600,
      lng: -0.2050,
      status: 'progress',
      urgent: true,
      createdAt: now - 1000 * 60 * 130
    }, {
      id: sdrrsId('RPT'),
      type: 'Medical',
      severity: 'medium',
      desc: 'Multiple people affected by suspected food poisoning at a community event.',
      lat: 5.6145,
      lng: -0.1650,
      status: 'pending',
      urgent: false,
      createdAt: now - 1000 * 60 * 220
    }, {
      id: sdrrsId('RPT'),
      type: 'Building Collapse',
      severity: 'high',
      desc: 'Partial collapse of an under-construction structure, possible people trapped.',
      lat: 5.5730,
      lng: -0.2400,
      status: 'progress',
      urgent: true,
      createdAt: now - 1000 * 60 * 300
    }, {
      id: sdrrsId('RPT'),
      type: 'Other',
      severity: 'low',
      desc: 'Fallen tree blocking a secondary road after heavy winds.',
      lat: 5.6300,
      lng: -0.1950,
      status: 'resolved',
      urgent: false,
      createdAt: now - 1000 * 60 * 500
    }];
    sdrrsSet(SDRRS_KEYS.REPORTS, seed);
  }

  if (sdrrsGet(SDRRS_KEYS.VOLUNTEERS).length === 0) {
    var _seed = [{
      id: sdrrsId('VOL'),
      name: 'Ama Boateng',
      phone: '+233 24 555 0110',
      location: 'Accra',
      skills: ['First Aid', 'Driving'],
      availability: 'Weekends',
      createdAt: Date.now() - 1000 * 60 * 60 * 20
    }, {
      id: sdrrsId('VOL'),
      name: 'Kojo Mensah',
      phone: '+233 20 555 0432',
      location: 'Tema',
      skills: ['Search & Rescue', 'Medical'],
      availability: 'Anytime',
      createdAt: Date.now() - 1000 * 60 * 60 * 40
    }];
    sdrrsSet(SDRRS_KEYS.VOLUNTEERS, _seed);
  }
}
/* ---------------------- Navbar mobile toggle ---------------------- */


function initNav() {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      return links.classList.toggle('open');
    });
  } // mark active link


  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}
/* ---------------------- 3D tilt for .tilt-card ---------------------- */


function initTiltCards() {
  var cards = document.querySelectorAll('.tilt-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rx = (x - cx) / cx * 8; // rotateY

      var ry = (cy - y) / cy * 8; // rotateX

      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}
/* ---------------------- Reveal-on-scroll for [data-reveal] ---------------------- */


function initReveal() {
  var items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  items.forEach(function (el) {
    return io.observe(el);
  });
}
/* ---------------------- Toast ---------------------- */


function showToast(title, message, icon) {
  var toast = document.getElementById('sdrrsToast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sdrrsToast';
    toast.className = 'toast glass';
    toast.innerHTML = "<div class=\"t-icon\">".concat(icon || '✓', "</div><div><h4></h4><p></p></div>");
    document.body.appendChild(toast);
  }

  toast.querySelector('.t-icon').textContent = icon || '✓';
  toast.querySelector('h4').textContent = title;
  toast.querySelector('p').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    return toast.classList.remove('show');
  }, 4200);
}
/* ---------------------- Geolocation helper ---------------------- */


function sdrrsLocate(onSuccess, onError) {
  if (!navigator.geolocation) {
    onError && onError('Geolocation is not supported on this device.');
    return;
  }

  navigator.geolocation.getCurrentPosition(function (pos) {
    return onSuccess(pos.coords.latitude, pos.coords.longitude);
  }, function (err) {
    return onError && onError('Location access denied. You can enter it manually.');
  }, {
    enableHighAccuracy: true,
    timeout: 8000
  });
}
/* ---------------------- Floating SOS button + modal (every page) ---------------------- */


function injectSOS() {
  if (document.getElementById('sdrrsFab')) return;
  var fab = document.createElement('button');
  fab.id = 'sdrrsFab';
  fab.className = 'fab-sos';
  fab.setAttribute('aria-label', 'Send rescue request');
  fab.innerHTML = 'SOS<br>RESCUE';
  document.body.appendChild(fab);
  var backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'sosModal';
  backdrop.innerHTML = "\n    <div class=\"modal-box glass-strong\">\n      <button class=\"modal-close\" id=\"sosClose\" aria-label=\"Close\">&times;</button>\n      <div class=\"eyebrow\">Immediate rescue request</div>\n      <h3>Request emergency rescue</h3>\n      <p>This sends your live location straight to the response network as an urgent case. Only use for real emergencies.</p>\n      <div class=\"location-box\">\n        <div>\n          <div class=\"status\" id=\"sosLocStatus\">Tap \"Share my location\" to continue</div>\n          <div class=\"coords mono\" id=\"sosCoords\"></div>\n        </div>\n        <button class=\"btn btn-ghost btn-sm\" id=\"sosLocBtn\" type=\"button\">\uD83D\uDCCD Share my location</button>\n      </div>\n      <div class=\"field\">\n        <label for=\"sosNote\">What's happening? <span class=\"req\">*</span></label>\n        <textarea id=\"sosNote\" placeholder=\"e.g. Trapped on rooftop, flood water rising fast\"></textarea>\n      </div>\n      <button class=\"btn btn-primary btn-block\" id=\"sosSend\" type=\"button\" disabled>\uD83D\uDEA8 Send rescue request</button>\n    </div>\n  ";
  document.body.appendChild(backdrop);
  var coords = null;

  var open = function open() {
    return backdrop.classList.add('show');
  };

  var close = function close() {
    return backdrop.classList.remove('show');
  };

  fab.addEventListener('click', open);
  backdrop.querySelector('#sosClose').addEventListener('click', close);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) close();
  });
  var sendBtn = backdrop.querySelector('#sosSend');
  var locBtn = backdrop.querySelector('#sosLocBtn');
  var locStatus = backdrop.querySelector('#sosLocStatus');
  var coordsEl = backdrop.querySelector('#sosCoords');
  locBtn.addEventListener('click', function () {
    locStatus.innerHTML = '<span class="spinner"></span> Locating you...';
    sdrrsLocate(function (lat, lng) {
      coords = {
        lat: lat,
        lng: lng
      };
      locStatus.textContent = 'Location captured ✓';
      coordsEl.textContent = "LAT ".concat(lat.toFixed(5), "  LNG ").concat(lng.toFixed(5));
      sendBtn.disabled = false;
    }, function (msg) {
      locStatus.textContent = msg;
    });
  });
  sendBtn.addEventListener('click', function () {
    var note = backdrop.querySelector('#sosNote').value.trim();

    if (!coords) {
      locStatus.textContent = 'Please share your location first.';
      return;
    }

    var reports = sdrrsGet(SDRRS_KEYS.REPORTS);
    reports.unshift({
      id: sdrrsId('RPT'),
      type: 'SOS Rescue',
      severity: 'high',
      desc: note || 'Urgent rescue request — no description provided.',
      lat: coords.lat,
      lng: coords.lng,
      status: 'pending',
      urgent: true,
      createdAt: Date.now()
    });
    sdrrsSet(SDRRS_KEYS.REPORTS, reports);
    close();
    showToast('Rescue request sent', 'Your location was shared with the response team. Stay safe.', '🚨');
    backdrop.querySelector('#sosNote').value = '';
    sendBtn.disabled = true;
    locStatus.textContent = 'Tap "Share my location" to continue';
    coordsEl.textContent = '';
    coords = null;
  });
}
/* ---------------------- Boot ---------------------- */


document.addEventListener('DOMContentLoaded', function () {
  sdrrsSeedIfEmpty();
  initNav();
  initTiltCards();
  initReveal();
  injectSOS();
});
//# sourceMappingURL=main.dev.js.map
