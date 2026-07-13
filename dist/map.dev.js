"use strict";

/* ============================================================
   SDRRS — map.js
   Renders reported incidents on a Leaflet map with filtering.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  var defaultCenter = [5.6037, -0.1870]; // Accra, Ghana — fallback centre

  var map = L.map('liveMap', {
    zoomControl: true
  }).setView(defaultCenter, 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(map);
  var markers = [];
  var currentFilter = 'all';

  function severityColor(sev) {
    if (sev === 'high') return '#ff3b5c';
    if (sev === 'medium') return '#ffb020';
    return '#23d18b';
  }

  function makeIcon(report) {
    var color = report.status === 'resolved' ? '#23d18b' : severityColor(report.severity);
    var pulse = report.urgent && report.status !== 'resolved' ? 'animation:live-pulse 1.8s infinite;' : '';
    var html = "<div style=\"width:18px;height:18px;border-radius:50%;background:".concat(color, ";\n                  box-shadow:0 0 0 4px rgba(255,255,255,0.08), 0 0 14px ").concat(color, ";").concat(pulse, "\"></div>");
    return L.divIcon({
      html: html,
      className: '',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
  }

  function timeAgo(ts) {
    var mins = Math.round((Date.now() - ts) / 60000);
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + ' hr ago';
    return Math.round(hrs / 24) + ' day(s) ago';
  }

  function renderMarkers() {
    markers.forEach(function (m) {
      return map.removeLayer(m);
    });
    markers = [];
    var reports = sdrrsGet(SDRRS_KEYS.REPORTS);
    var filtered = reports.filter(function (r) {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'urgent') return r.urgent;
      return r.type === currentFilter;
    });
    filtered.forEach(function (r) {
      var marker = L.marker([r.lat, r.lng], {
        icon: makeIcon(r)
      }).addTo(map);
      marker.bindPopup("\n        <div class=\"popup-title\">".concat(r.type).concat(r.urgent ? ' 🚨' : '', "</div>\n        <div class=\"popup-meta\">STATUS: ").concat(r.status.toUpperCase(), " \xB7 ").concat(timeAgo(r.createdAt), "</div>\n        <div class=\"popup-meta\">LAT ").concat(r.lat.toFixed(4), ", LNG ").concat(r.lng.toFixed(4), "</div>\n        <div style=\"font-size:13.5px;max-width:220px;\">").concat(r.desc, "</div>\n      "));
      markers.push(marker);
    });

    if (filtered.length === 0) {
      L.popup().setLatLng(defaultCenter).setContent('No reports match this filter yet.').openOn(map);
    }
  }

  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filter-chip').forEach(function (c) {
        return c.classList.remove('active');
      });
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderMarkers();
    });
  });
  renderMarkers(); // keep the map fresh if reports change in another tab/page

  window.addEventListener('storage', function (e) {
    if (e.key === SDRRS_KEYS.REPORTS) renderMarkers();
  });
});
//# sourceMappingURL=map.dev.js.map
