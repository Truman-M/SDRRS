"use strict";

/**
 * SMART DISASTER RESPONSE & RESCUE PLATFORM
 * Core Scalable Multi-Page Micro-Service Script Engine (Vanilla ES6+)
 */
// REGIONAL INCIDENT CORE SEED DATA INTERCEPTOR
var DEFAULT_INCIDENTS = [{
  id: "INC-8831",
  type: "Severe Seismic Disruption",
  geo: "37.7749, -122.4194",
  desc: "Structural collapse inside residential complex grid layout. Estimated 4 victims pinned inside.",
  status: "PENDING",
  severity: "High"
}, {
  id: "INC-8832",
  type: "Flood / Flash Inundation",
  geo: "34.0522, -118.2437",
  desc: "Arterial infrastructure bypass flash inundation. Two civilian logistical assets submersed.",
  status: "PENDING",
  severity: "Medium"
}, {
  id: "INC-8833",
  type: "Structure Fire Outbreak",
  geo: "40.7128, -74.0060",
  desc: "Multi-tier commercial architecture fire propagation. High altitude toxic smoke spread vectors.",
  status: "DISPATCHED",
  severity: "High"
}, {
  id: "INC-8834",
  type: "Hazardous Chemical Leak",
  geo: "47.6062, -122.3321",
  desc: "Industrial container breach. Ammonia vapor venting into local civic zones.",
  status: "RESOLVED",
  severity: "Low"
}]; // INITIALIZE BROWSERS CENTRAL DATABASING LOCAL CHANNELS

if (!localStorage.getItem("smart_rescue_db")) {
  localStorage.setItem("smart_rescue_db", JSON.stringify(DEFAULT_INCIDENTS));
}

function getDatabase() {
  return JSON.parse(localStorage.getItem("smart_rescue_db"));
}

function saveDatabase(data) {
  localStorage.setItem("smart_rescue_db", JSON.stringify(data));
} // FIRST AID AUTOMATED DATA PATTERNS


var MEDICAL_INTELLIGENCE_BASE = {
  "bleeding": "<strong>CRITICAL ARTERIAL BLEEDING:</strong><br>1. Pack dressings deep over the open rupture point.<br>2. Exert heavy continuous physical compression downwards.<br>3. If extremity blood flow persists, apply a mechanical tourniquet high and tight above the injury instantly.",
  "fracture": "<strong>STRUCTURAL BONE FRACTURE:</strong><br>1. Do not adjust or force misaligned bone structures.<br>2. Immobilize the entire limb using adjacent rigid items as structural splints.<br>3. Check distal vascular pulse presence regularly to ensure proper circulation.",
  "smoke": "<strong>TOXIC SMOKE INHALATION:</strong><br>1. Immediately move victims into open, high-ventilation spaces.<br>2. Stay close to ground level to avoid denser vertical heat and gas bands.<br>3. Administer supplementary emergency oxygen if respiratory depression occurs.",
  "burn": "<strong>THERMAL FLASH BURNS:</strong><br>1. Flood the thermal surface under cool, non-pressurized water pathways for 10-20 minutes.<br>2. Remove jewelry and tight bands before tissue edema propagates.<br>3. Protect the area using non-adherent sterile protective sheets."
}; // DYNAMIC HEADER INJECTOR TEMPLATE GENERATOR

function initializePageStructure(activePage) {
  var host = document.getElementById("headerHost");
  if (!host) return; // Fetch static modular structural content

  fetch("header.html").then(function (res) {
    return res.text();
  }).then(function (html) {
    host.innerHTML = html;
    compileNavigationTabs(activePage);
  })["catch"](function (err) {
    return console.error("Nav Framework Link Fail, compiling fallback matrix:", err);
  });
  injectFloatingChatbotWidget();
  applyAccessibilitySettingsOnLoad();
}

function compileNavigationTabs(activePage) {
  var pages = {
    "index.html": '<i class="fa-solid fa-house mr-1.5"></i>Home Vector',
    "map.html": '<i class="fa-solid fa-map-location-dot mr-1.5"></i>Situation Map',
    "volunteer.html": '<i class="fa-solid fa-hands-holding-child mr-1.5"></i>Auxiliary Hub',
    "directory.html": '<i class="fa-solid fa-address-book mr-1.5"></i>Directory Node',
    "admin.html": '<i class="fa-solid fa-tower-radar mr-1.5"></i>Command Operations'
  };
  var desktopNav = "";
  var mobileNav = "";

  for (var filename in pages) {
    var isCurrent = filename === activePage;
    var deskClass = isCurrent ? "bg-red-600 text-white shadow-lg shadow-red-900/30" : "text-slate-400 hover:text-white hover:bg-slate-800/40";
    var mobClass = isCurrent ? "bg-red-600 text-white" : "text-slate-300 hover:bg-slate-800";
    desktopNav += "<a href=\"".concat(filename, "\" class=\"px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ").concat(deskClass, "\">").concat(pages[filename], "</a>");
    mobileNav += "<a href=\"".concat(filename, "\" class=\"w-full text-left px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors ").concat(mobClass, "\">").concat(pages[filename], "</a>");
  }

  var dContainer = document.getElementById("globalNavTabs");
  var mContainer = document.getElementById("mobileMenu");
  if (dContainer) dContainer.innerHTML = desktopNav;
  if (mContainer) mContainer.innerHTML = mobileNav;
}

function toggleMobileMenu() {
  var m = document.getElementById("mobileMenu");
  if (m) m.classList.toggle("hidden");
} // INCLUSIVE ACCESSIBILITY MATRIX UTILITIES


function toggleAccessibility(actionType) {
  if (actionType === 'contrast') {
    document.body.classList.toggle('high-contrast-mode');
    localStorage.setItem("accessibility_contrast", document.body.classList.contains('high-contrast-mode'));
  } else if (actionType === 'font-plus') {
    var size = parseFloat(window.getComputedStyle(document.body).fontSize);

    if (size < 22) {
      document.body.style.fontSize = size + 1 + "px";
      localStorage.setItem("accessibility_font", size + 1 + "px");
    } else {
      document.body.style.fontSize = "15px";
      localStorage.setItem("accessibility_font", "15px");
    }
  }
}

function applyAccessibilitySettingsOnLoad() {
  if (localStorage.getItem("accessibility_contrast") === "true") {
    document.body.classList.add('high-contrast-mode');
  }

  if (localStorage.getItem("accessibility_font")) {
    document.body.style.fontSize = localStorage.getItem("accessibility_font");
  }
} // GIS GEOSPATIAL MAP COMPILING ENGINE


var mapAgent;

function initializeMapEngine() {
  var mapBox = document.getElementById("map");
  if (!mapBox) return;

  try {
    mapAgent = L.map('map', {
      zoomControl: false
    }).setView([38.0000, -97.0000], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(mapAgent);
    L.control.zoom({
      position: 'topright'
    }).addTo(mapAgent);
    plotLiveMarkersOnMapContainer();
    renderSidebarTickerFeed();
  } catch (e) {
    console.error("GIS Fail. Processing backup offline visualization mesh framework: ", e);
  }
}

function plotLiveMarkersOnMapContainer() {
  if (!mapAgent) return; // Clear out preceding layers

  mapAgent.eachLayer(function (layer) {
    if (layer instanceof L.Marker) mapAgent.removeLayer(layer);
  });
  var db = getDatabase();
  db.forEach(function (node) {
    var parts = node.geo.split(",");
    var lat = parseFloat(parts[0]) || 39.82;
    var lng = parseFloat(parts[1]) || -98.57;
    var markerColor = node.severity === "High" ? "red" : "orange";
    if (node.status === "RESOLVED") markerColor = "emerald";
    var pulseIcon = L.divIcon({
      className: 'custom-map-icon',
      html: "<div class=\"relative flex items-center justify-center w-8 h-8\">\n                <span class=\"absolute inline-flex h-full w-full rounded-full bg-".concat(markerColor, "-500 opacity-40 ping-layer\"></span>\n                <div class=\"relative w-4 h-4 bg-").concat(markerColor, "-500 rounded-full border-2 border-white shadow-xl\"></div>\n            </div>"),
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    L.marker([lat, lng], {
      icon: pulseIcon
    }).addTo(mapAgent).bindPopup("<div class=\"text-slate-900 font-sans p-1\"><p class=\"text-xs font-black uppercase text-red-600\">".concat(node.id, ": ").concat(node.type, "</p><p class=\"text-[11px] font-medium mt-1\">").concat(node.desc, "</p></div>"));
  });
}

function renderSidebarTickerFeed() {
  var stream = document.getElementById("incidentTickerStream");
  if (!stream) return;
  var db = getDatabase();
  stream.innerHTML = "";
  var pendingCount = 0;
  db.slice().reverse().forEach(function (node, i) {
    if (node.status !== "RESOLVED") pendingCount++;
    var sevStyle = node.severity === 'High' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    var statusStyle = node.status === 'PENDING' ? 'bg-slate-900 border border-red-500/20 text-red-400' : node.status === 'DISPATCHED' ? 'bg-blue-950 border border-blue-500/30 text-blue-400 animate-pulse' : 'bg-emerald-950 border border-emerald-500/30 text-emerald-400';
    var box = document.createElement("div");
    box.className = "p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5 stream-item";
    box.style.animationDelay = "".concat(i * 60, "ms");
    box.innerHTML = "\n            <div class=\"flex items-center justify-between\">\n                <span class=\"text-[10px] font-mono text-slate-500 font-bold\">".concat(node.id, "</span>\n                <span class=\"px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ").concat(sevStyle, "\">").concat(node.severity, "</span>\n            </div>\n            <h4 class=\"text-xs font-bold text-slate-200\">").concat(node.type, "</h4>\n            <p class=\"text-[11px] text-slate-400 line-clamp-2\">").concat(node.desc, "</p>\n            <div class=\"flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[9px]\">\n                <span class=\"text-slate-500 font-mono\"><i class=\"fa-solid fa-crosshairs mr-1\"></i>").concat(node.geo, "</span>\n                <span class=\"px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ").concat(statusStyle, "\">").concat(node.status, "</span>\n            </div>\n        ");
    stream.appendChild(box);
  });
  document.getElementById("tickerCount").innerText = "".concat(pendingCount, " ACTIVE VECTORS");
} // INTAKE GEOLOCATION TELEMETRY INTERCEPTOR


function autoDetectLocation() {
  var geoInput = document.getElementById('incidentLocation');
  if (!geoInput) return;
  geoInput.placeholder = "Awaiting internal system tracking lock...";
  setTimeout(function () {
    var lat = (36.0000 + (Math.random() - 0.5) * 6).toFixed(4);
    var lng = (-115.0000 + (Math.random() - 0.5) * 12).toFixed(4);
    geoInput.value = "".concat(lat, ", ").concat(lng);
  }, 1000);
} // FORM TRANSACTION CAPTURE PIPELINE


function handleEmergencySubmit(e) {
  e.preventDefault();
  var type = document.getElementById('incidentType').value;
  var location = document.getElementById('incidentLocation').value;
  var desc = document.getElementById('incidentDesc').value;
  var token = "INC-".concat(Math.floor(8000 + Math.random() * 2000));
  var newLog = {
    id: token,
    type: type,
    geo: location,
    desc: desc,
    status: "PENDING",
    severity: "High"
  };
  var db = getDatabase();
  db.push(newLog);
  saveDatabase(db);
  document.getElementById('emergencyReportForm').reset();
  alert("INCIDENT QUEUED TRACE TOKEN ID: ".concat(token, "\nCommand grids synchronized across multi-page telemetry streams."));
} // FLOATING SOS OVERLAY COUNTDOWN SEQUENCER


var countdownTimer;

function triggerSOSCountdown() {
  var overlay = document.getElementById('sosOverlay');
  var display = document.getElementById('sosCountdown');
  var value = 3;
  overlay.classList.remove('hidden');
  setTimeout(function () {
    return overlay.classList.add('opacity-100');
  }, 10);
  display.innerText = value;
  countdownTimer = setInterval(function () {
    value--;

    if (value > 0) {
      display.innerText = value;
    } else {
      clearInterval(countdownTimer);
      executeSOSBroadcastVector();
    }
  }, 1000);
}

function cancelSOS() {
  clearInterval(countdownTimer);
  var overlay = document.getElementById('sosOverlay');
  overlay.classList.remove('opacity-100');
  setTimeout(function () {
    return overlay.classList.add('hidden');
  }, 300);
}

function executeSOSBroadcastVector() {
  var overlay = document.getElementById('sosOverlay');
  overlay.classList.remove('opacity-100');
  setTimeout(function () {
    return overlay.classList.add('hidden');
  }, 300);
  var token = "SOS-".concat(Math.floor(9000 + Math.random() * 1000));
  var sosLog = {
    id: token,
    type: "CRITICAL LIFE THREAT VECTOR (SOS)",
    geo: "36.1699, -115.1398",
    desc: "Automated distress telemetry system bypass fired from high priority citizen terminal node.",
    status: "PENDING",
    severity: "High"
  };
  var db = getDatabase();
  db.push(sosLog);
  saveDatabase(db);
  alert("CRITICAL SOS SYNCHRONIZED\nTracking index: ".concat(token, ". Regional intercept tactical squadrons have been authorized."));
} // ADMIN DASHBOARD RENDERING & MUTATIONS AGENT


function renderAdminDashboardMatrix() {
  var table = document.getElementById("adminIncidentTable");
  if (!table) return;
  var db = getDatabase();
  table.innerHTML = "";
  var total = db.length;
  var pending = db.filter(function (i) {
    return i.status === 'PENDING';
  }).length;
  var resolved = db.filter(function (i) {
    return i.status === 'RESOLVED';
  }).length;
  document.getElementById("metricTotal").innerText = total;
  document.getElementById("metricPending").innerText = pending;
  document.getElementById("metricResolved").innerText = resolved;
  db.slice().reverse().forEach(function (node) {
    var badgeStyle = node.status === 'PENDING' ? 'bg-slate-900 border border-red-500/20 text-red-400' : node.status === 'DISPATCHED' ? 'bg-blue-950 border border-blue-500/30 text-blue-400 animate-pulse' : 'bg-emerald-950 border border-emerald-500/30 text-emerald-400';
    var row = document.createElement("tr");
    row.className = "hover:bg-slate-900/30 border-b border-slate-900/60 transition-colors";
    row.innerHTML = "\n            <td class=\"p-4 font-mono font-bold text-slate-400\">".concat(node.id, "</td>\n            <td class=\"p-4 font-bold text-slate-200\">").concat(node.type, "</td>\n            <td class=\"p-4 font-mono text-slate-400 text-xs\"><i class=\"fa-solid fa-location-dot text-slate-600 mr-2\"></i>").concat(node.geo, "</td>\n            <td class=\"p-4\"><span class=\"px-2.5 py-1 rounded-full font-bold uppercase text-[10px] tracking-wide ").concat(badgeStyle, "\">").concat(node.status, "</span></td>\n            <td class=\"p-4 text-right\">\n                ").concat(node.status === 'PENDING' ? "<button onclick=\"mutateNodeState('".concat(node.id, "', 'DISPATCHED')\" class=\"px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] uppercase rounded-lg transition-all tracking-wider\">Authorize Dispatch</button>") : node.status === 'DISPATCHED' ? "<button onclick=\"mutateNodeState('".concat(node.id, "', 'RESOLVED')\" class=\"px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase rounded-lg transition-all tracking-wider\">Resolve Vector</button>") : "<span class=\"text-slate-500 text-xs italic\"><i class=\"fa-solid fa-circle-check text-emerald-500 mr-1.5\"></i>Deployment Complete</span>", "\n            </td>\n        ");
    table.appendChild(row);
  });
}

function mutateNodeState(id, targetState) {
  var db = getDatabase();
  var index = db.findIndex(function (item) {
    return item.id === id;
  });

  if (index !== -1) {
    db[index].status = targetState;
    saveDatabase(db);
    renderAdminDashboardMatrix();
  }
} // EXPERT MEDICAL TRUTHFUL AUTOMATED FLOATING AGENT WIDGET


function injectFloatingChatbotWidget() {
  var container = document.getElementById("chatbotHost");
  if (!container) return;
  container.innerHTML = "\n        <div id=\"chatbotBox\" class=\"w-80 sm:w-96 h-[460px] glass-panel border-slate-700/60 rounded-2xl flex flex-col shadow-2xl mb-4 hidden opacity-0 transition-all duration-300 transform translate-y-4\">\n            <div class=\"p-4 border-b border-slate-800 bg-slate-900/80 rounded-t-2xl flex items-center justify-between\">\n                <div class=\"flex items-center gap-2.5\">\n                    <div class=\"w-2 h-2 rounded-full bg-cyan-400 animate-pulse\"></div>\n                    <div>\n                        <h4 class=\"text-xs font-black uppercase tracking-wider text-white\">AI First Aid Assistant</h4>\n                        <p class=\"text-[10px] text-cyan-400 font-medium\">Automatic Crisis Knowledge Node</p>\n                    </div>\n                </div>\n                <button onclick=\"toggleChatbotUI()\" class=\"text-slate-500 hover:text-white p-1 text-sm\"><i class=\"fa-solid fa-xmark\"></i></button>\n            </div>\n            <div id=\"chatMessages\" class=\"flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed no-scrollbar\">\n                <div class=\"bg-slate-900/80 border border-slate-800 p-3 rounded-xl max-w-[85%] text-slate-300\">System Link Confirmed. I am the triage first-aid automated tactical assistant. <strong>Select a target symptom baseline below</strong> or input critical keywords for direct mitigation parameters.</div>\n            </div>\n            <div class=\"px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar\">\n                <button onclick=\"triggerPresetReply('Severe Arterial Bleeding')\" class=\"px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold transition-all\">Arterial Bleeding</button>\n                <button onclick=\"triggerPresetReply('Compound Structural Fracture')\" class=\"px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold transition-all\">Bone Fracture</button>\n                <button onclick=\"triggerPresetReply('Toxic Smoke Inhalation')\" class=\"px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold transition-all\">Smoke Inhalation</button>\n                <button onclick=\"triggerPresetReply('Thermal Flash Burn Triage')\" class=\"px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold transition-all\">Thermal Burn</button>\n            </div>\n            <div class=\"p-3 border-t border-slate-800 bg-slate-900/60 rounded-b-2xl flex gap-2\">\n                <input type=\"text\" id=\"chatInput\" placeholder=\"Input crisis keyword (e.g. burn, bleed)...\" onkeydown=\"if(event.key === 'Enter') handleChatInputSubmit()\" class=\"w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-slate-200\">\n                <button onclick=\"handleChatInputSubmit()\" class=\"px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs transition-colors\"><i class=\"fa-solid fa-paper-plane\"></i></button>\n            </div>\n        </div>\n        <button onclick=\"toggleChatbotUI()\" class=\"w-12 h-12 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl flex items-center justify-center shadow-2xl transition-all active:scale-95 group relative border border-cyan-400/20\">\n            <span class=\"absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-slate-950 rounded-full animate-ping\"></span>\n            <span class=\"absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-slate-950 rounded-full\"></span>\n            <i class=\"fa-solid fa-user-doctor text-lg group-hover:rotate-12 transition-transform\"></i>\n        </button>\n    ";
}

function toggleChatbotUI() {
  var box = document.getElementById('chatbotBox');

  if (box.classList.contains('hidden')) {
    box.classList.remove('hidden');
    setTimeout(function () {
      box.classList.remove('opacity-0', 'translate-y-4');
      box.classList.add('opacity-100', 'translate-y-0');
    }, 10);
  } else {
    box.classList.add('opacity-0', 'translate-y-4');
    box.classList.remove('opacity-100', 'translate-y-0');
    setTimeout(function () {
      return box.classList.add('hidden');
    }, 300);
  }
}

function triggerPresetReply(text) {
  appendLogMessage(text, 'user');
  var key = 'bleeding';
  if (text.includes('Fracture')) key = 'fracture';
  if (text.includes('Smoke')) key = 'smoke';
  if (text.includes('Burn')) key = 'burn';
  setTimeout(function () {
    return appendLogMessage(MEDICAL_INTELLIGENCE_BASE[key], 'bot');
  }, 400);
}

function handleChatInputSubmit() {
  var input = document.getElementById('chatInput');
  var text = input.value.trim();
  if (!text) return;
  appendLogMessage(text, 'user');
  input.value = '';
  setTimeout(function () {
    var output = "<strong>QUERY CAPTURED:</strong> Systematic translation matched no exact verified triage rules. Input direct metrics keyword: <strong>'burn', 'bleeding', 'fracture', or 'smoke'</strong> for instruction extraction.";
    var norm = text.toLowerCase();

    for (var target in MEDICAL_INTELLIGENCE_BASE) {
      if (norm.includes(target)) {
        output = MEDICAL_INTELLIGENCE_BASE[target];
        break;
      }
    }

    appendLogMessage(output, 'bot');
  }, 500);
}

function appendLogMessage(msg, role) {
  var space = document.getElementById('chatMessages');
  var wrapper = document.createElement('div');
  wrapper.className = role === 'user' ? "bg-cyan-950/60 border border-cyan-800 text-cyan-200 p-2.5 rounded-xl max-w-[85%] ml-auto text-right font-medium" : "bg-slate-900/90 border border-slate-800 text-slate-300 p-2.5 rounded-xl max-w-[85%] mr-auto text-left";
  wrapper.innerHTML = msg;
  space.appendChild(wrapper);
  space.scrollTop = space.scrollHeight;
} // VOLUNTEER DISPATCH MOCK


function handleVolunteerSubmit(e) {
  e.preventDefault();
  document.getElementById('volunteerSuccess').classList.remove('hidden');
}

function resetVolunteerForm() {
  document.getElementById('volunteerSuccess').classList.add('hidden');
  document.getElementById('volunteerForm').reset();
} // DIRECTORY LOCAL LIVE MATCH FILTERING


function filterDirectory() {
  var val = document.getElementById('directorySearch').value.toLowerCase();
  var nodes = document.querySelectorAll('.directory-node');
  nodes.forEach(function (n) {
    if (n.getAttribute('data-name').includes(val)) n.classList.remove('hidden');else n.classList.add('hidden');
  });
}

function triggerMockCall(node) {
  alert("VOIP TUNNEL INITIALIZED\nRouting operational satellite connection matrix path to: ".concat(node));
}
//# sourceMappingURL=script.dev.js.map
