/* ============================================================
   SDRRS — main.js
   Shared across every page: nav, tilt cards, storage, toast,
   the floating SOS button + modal, geolocation helper.
   ============================================================ */

/* ---------------------- Storage keys & helpers ---------------------- */
const SDRRS_KEYS = {
  REPORTS: 'sdrrs_reports',
  VOLUNTEERS: 'sdrrs_volunteers',
  ADMIN_SESSION: 'sdrrs_admin_session'
};

function sdrrsGet(key){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error('SDRRS storage read error', e);
    return [];
  }
}
function sdrrsSet(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }catch(e){
    console.error('SDRRS storage write error', e);
    return false;
  }
}
function sdrrsId(prefix){
  return prefix + '-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.floor(Math.random()*90+10);
}
function sdrrsSeedIfEmpty(){
  if (sdrrsGet(SDRRS_KEYS.REPORTS).length === 0){
    const now = Date.now();
    const seed = [
      { id: sdrrsId('RPT'), type:'Flood', severity:'high', desc:'Rising water levels near the riverside market, several homes surrounded.', lat:5.6037, lng:-0.1870, status:'pending', urgent:true, createdAt: now - 1000*60*40 },
      { id: sdrrsId('RPT'), type:'Fire', severity:'high', desc:'Warehouse fire spreading toward nearby residential block.', lat:5.5600, lng:-0.2050, status:'progress', urgent:true, createdAt: now - 1000*60*130 },
      { id: sdrrsId('RPT'), type:'Medical', severity:'medium', desc:'Multiple people affected by suspected food poisoning at a community event.', lat:5.6145, lng:-0.1650, status:'pending', urgent:false, createdAt: now - 1000*60*220 },
      { id: sdrrsId('RPT'), type:'Building Collapse', severity:'high', desc:'Partial collapse of an under-construction structure, possible people trapped.', lat:5.5730, lng:-0.2400, status:'progress', urgent:true, createdAt: now - 1000*60*300 },
      { id: sdrrsId('RPT'), type:'Other', severity:'low', desc:'Fallen tree blocking a secondary road after heavy winds.', lat:5.6300, lng:-0.1950, status:'resolved', urgent:false, createdAt: now - 1000*60*500 }
    ];
    sdrrsSet(SDRRS_KEYS.REPORTS, seed);
  }
  if (sdrrsGet(SDRRS_KEYS.VOLUNTEERS).length === 0){
    const seed = [
      { id: sdrrsId('VOL'), name:'Ama Boateng', phone:'+233 24 555 0110', location:'Accra', skills:['First Aid','Driving'], availability:'Weekends', createdAt: Date.now() - 1000*60*60*20 },
      { id: sdrrsId('VOL'), name:'Kojo Mensah', phone:'+233 20 555 0432', location:'Tema', skills:['Search & Rescue','Medical'], availability:'Anytime', createdAt: Date.now() - 1000*60*60*40 }
    ];
    sdrrsSet(SDRRS_KEYS.VOLUNTEERS, seed);
  }
}

/* ---------------------- Navbar mobile toggle ---------------------- */
function initNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links){
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
  // mark active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

const SDRRS_THEME_KEY = 'sdrrs_theme';

function applyTheme(theme){
  const useLight = theme === 'light';
  document.body.classList.toggle('light-mode', useLight);
  localStorage.setItem(SDRRS_THEME_KEY, theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn){
    btn.textContent = useLight ? '🌙 Dark' : '☀️ Light';
  }
  window.dispatchEvent(new CustomEvent('sdrrsThemeChange', { detail: { theme } }));
}

function initThemeToggle(){
  const navCta = document.querySelector('.nav-cta');
  if (!navCta) return;

  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.id = 'themeToggleBtn';
  toggleButton.className = 'theme-toggle';
  toggleButton.title = 'Toggle light/dark mode';
  toggleButton.textContent = '☀️ Light';

  toggleButton.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  navCta.prepend(toggleButton);
  const savedTheme = localStorage.getItem(SDRRS_THEME_KEY) || 'dark';
  applyTheme(savedTheme);
}

/* ---------------------- 3D tilt for .tilt-card ---------------------- */
function initTiltCards(){
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((x - cx) / cx) * 8;   // rotateY
      const ry = ((cy - y) / cy) * 8;   // rotateX
      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ---------------------- Reveal-on-scroll for [data-reveal] ---------------------- */
function initReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.animationPlayState = 'running';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

/* ---------------------- Toast ---------------------- */
function showToast(title, message, icon){
  let toast = document.getElementById('sdrrsToast');
  if (!toast){
    toast = document.createElement('div');
    toast.id = 'sdrrsToast';
    toast.className = 'toast glass';
    toast.innerHTML = `<div class="t-icon">${icon || '✓'}</div><div><h4></h4><p></p></div>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.t-icon').textContent = icon || '✓';
  toast.querySelector('h4').textContent = title;
  toast.querySelector('p').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 4200);
}

/* ---------------------- Geolocation helper ---------------------- */
function sdrrsLocate(onSuccess, onError){
  if (!navigator.geolocation){
    onError && onError('Geolocation is not supported on this device.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => onSuccess(pos.coords.latitude, pos.coords.longitude),
    (err) => onError && onError('Location access denied. You can enter it manually.'),
    { enableHighAccuracy:true, timeout:8000 }
  );
}

/* ---------------------- Floating SOS button + modal (every page) ---------------------- */
function injectSOS(){
  if (document.getElementById('sdrrsFab')) return;

  const fab = document.createElement('button');
  fab.id = 'sdrrsFab';
  fab.className = 'fab-sos';
  fab.setAttribute('aria-label', 'Send rescue request');
  fab.innerHTML = 'SOS<br>RESCUE';
  document.body.appendChild(fab);

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'sosModal';
  backdrop.innerHTML = `
    <div class="modal-box glass-strong">
      <button class="modal-close" id="sosClose" aria-label="Close">&times;</button>
      <div class="eyebrow">Immediate rescue request</div>
      <h3>Request emergency rescue</h3>
      <p>This sends your live location straight to the response network as an urgent case. Only use for real emergencies.</p>
      <div class="location-box">
        <div>
          <div class="status" id="sosLocStatus">Tap "Share my location" to continue</div>
          <div class="coords mono" id="sosCoords"></div>
        </div>
        <button class="btn btn-ghost btn-sm" id="sosLocBtn" type="button">📍 Share my location</button>
      </div>
      <div class="field">
        <label for="sosNote">What's happening? <span class="req">*</span></label>
        <textarea id="sosNote" placeholder="e.g. Trapped on rooftop, flood water rising fast"></textarea>
      </div>
      <button class="btn btn-primary btn-block" id="sosSend" type="button" disabled>🚨 Send rescue request</button>
    </div>
  `;
  document.body.appendChild(backdrop);

  let coords = null;

  const open = () => backdrop.classList.add('show');
  const close = () => backdrop.classList.remove('show');

  fab.addEventListener('click', open);
  backdrop.querySelector('#sosClose').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  const sendBtn = backdrop.querySelector('#sosSend');
  const locBtn = backdrop.querySelector('#sosLocBtn');
  const locStatus = backdrop.querySelector('#sosLocStatus');
  const coordsEl = backdrop.querySelector('#sosCoords');

  locBtn.addEventListener('click', () => {
    locStatus.innerHTML = '<span class="spinner"></span> Locating you...';
    sdrrsLocate(
      (lat, lng) => {
        coords = { lat, lng };
        locStatus.textContent = 'Location captured ✓';
        coordsEl.textContent = `LAT ${lat.toFixed(5)}  LNG ${lng.toFixed(5)}`;
        sendBtn.disabled = false;
      },
      (msg) => { locStatus.textContent = msg; }
    );
  });

  sendBtn.addEventListener('click', () => {
    const note = backdrop.querySelector('#sosNote').value.trim();
    if (!coords){ locStatus.textContent = 'Please share your location first.'; return; }
    const reports = sdrrsGet(SDRRS_KEYS.REPORTS);
    reports.unshift({
      id: sdrrsId('RPT'),
      type: 'SOS Rescue',
      severity: 'high',
      desc: note || 'Urgent rescue request — no description provided.',
      lat: coords.lat, lng: coords.lng,
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
document.addEventListener('DOMContentLoaded', () => {
  sdrrsSeedIfEmpty();
  initNav();
  initThemeToggle();
  initTiltCards();
  initReveal();
  injectSOS();
});