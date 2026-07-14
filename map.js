/* ============================================================
   SDRRS — map.js
   Renders reported incidents on a Leaflet map with filtering.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const defaultCenter = [5.6037, -0.1870]; // Accra, Ghana — fallback centre
  const map = L.map('liveMap', { zoomControl: true }).setView(defaultCenter, 12);
  let tileLayer = null;

  function tileLayerUrl(){
    return document.body.classList.contains('light-mode')
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  }

  function refreshTiles(){
    if(tileLayer){ map.removeLayer(tileLayer); }
    tileLayer = L.tileLayer(tileLayerUrl(), {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);
  }

  refreshTiles();

  window.addEventListener('sdrrsThemeChange', () => refreshTiles());

  let markers = [];
  let currentFilter = 'all';

  function severityColor(sev){
    if (sev === 'high') return '#ff3b5c';
    if (sev === 'medium') return '#ffb020';
    return '#23d18b';
  }

  function makeIcon(report){
    const color = report.status === 'resolved' ? '#23d18b' : severityColor(report.severity);
    const pulse = report.urgent && report.status !== 'resolved' ? 'animation:live-pulse 1.8s infinite;' : '';
    const html = `<div style="width:18px;height:18px;border-radius:50%;background:${color};
                  box-shadow:0 0 0 4px rgba(255,255,255,0.08), 0 0 14px ${color};${pulse}"></div>`;
    return L.divIcon({ html, className: '', iconSize: [18,18], iconAnchor: [9,9] });
  }

  function timeAgo(ts){
    const mins = Math.round((Date.now() - ts) / 60000);
    if (mins < 60) return mins + ' min ago';
    const hrs = Math.round(mins/60);
    if (hrs < 24) return hrs + ' hr ago';
    return Math.round(hrs/24) + ' day(s) ago';
  }

  function renderMarkers(){
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const reports = sdrrsGet(SDRRS_KEYS.REPORTS);
    const filtered = reports.filter(r => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'urgent') return r.urgent;
      return r.type === currentFilter;
    });

    filtered.forEach(r => {
      const marker = L.marker([r.lat, r.lng], { icon: makeIcon(r) }).addTo(map);
      marker.bindPopup(`
        <div class="popup-title">${r.type}${r.urgent ? ' 🚨' : ''}</div>
        <div class="popup-meta">STATUS: ${r.status.toUpperCase()} · ${timeAgo(r.createdAt)}</div>
        <div class="popup-meta">LAT ${r.lat.toFixed(4)}, LNG ${r.lng.toFixed(4)}</div>
        <div style="font-size:13.5px;max-width:220px;">${r.desc}</div>
      `);
      markers.push(marker);
    });

    if (filtered.length === 0){
      L.popup().setLatLng(defaultCenter).setContent('No reports match this filter yet.').openOn(map);
    }
  }

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderMarkers();
    });
  });

  renderMarkers();

  // keep the map fresh if reports change in another tab/page
  window.addEventListener('storage', (e) => {
    if (e.key === SDRRS_KEYS.REPORTS) renderMarkers();
  });
});