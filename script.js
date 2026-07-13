/**
 * SMART DISASTER RESPONSE & RESCUE PLATFORM
 * Core Scalable Multi-Page Micro-Service Script Engine (Vanilla ES6+)
 */

// REGIONAL INCIDENT CORE SEED DATA INTERCEPTOR
const DEFAULT_INCIDENTS = [
    { id: "INC-8831", type: "Severe Seismic Disruption", geo: "37.7749, -122.4194", desc: "Structural collapse inside residential complex grid layout. Estimated 4 victims pinned inside.", status: "PENDING", severity: "High" },
    { id: "INC-8832", type: "Flood / Flash Inundation", geo: "34.0522, -118.2437", desc: "Arterial infrastructure bypass flash inundation. Two civilian logistical assets submersed.", status: "PENDING", severity: "Medium" },
    { id: "INC-8833", type: "Structure Fire Outbreak", geo: "40.7128, -74.0060", desc: "Multi-tier commercial architecture fire propagation. High altitude toxic smoke spread vectors.", status: "DISPATCHED", severity: "High" },
    { id: "INC-8834", type: "Hazardous Chemical Leak", geo: "47.6062, -122.3321", desc: "Industrial container breach. Ammonia vapor venting into local civic zones.", status: "RESOLVED", severity: "Low" }
];

// INITIALIZE BROWSERS CENTRAL DATABASING LOCAL CHANNELS
if (!localStorage.getItem("smart_rescue_db")) {
    localStorage.setItem("smart_rescue_db", JSON.stringify(DEFAULT_INCIDENTS));
}

function getDatabase() {
    return JSON.parse(localStorage.getItem("smart_rescue_db"));
}

function saveDatabase(data) {
    localStorage.setItem("smart_rescue_db", JSON.stringify(data));
}

// FIRST AID AUTOMATED DATA PATTERNS
const MEDICAL_INTELLIGENCE_BASE = {
    "bleeding": "<strong>CRITICAL ARTERIAL BLEEDING:</strong><br>1. Pack dressings deep over the open rupture point.<br>2. Exert heavy continuous physical compression downwards.<br>3. If extremity blood flow persists, apply a mechanical tourniquet high and tight above the injury instantly.",
    "fracture": "<strong>STRUCTURAL BONE FRACTURE:</strong><br>1. Do not adjust or force misaligned bone structures.<br>2. Immobilize the entire limb using adjacent rigid items as structural splints.<br>3. Check distal vascular pulse presence regularly to ensure proper circulation.",
    "smoke": "<strong>TOXIC SMOKE INHALATION:</strong><br>1. Immediately move victims into open, high-ventilation spaces.<br>2. Stay close to ground level to avoid denser vertical heat and gas bands.<br>3. Administer supplementary emergency oxygen if respiratory depression occurs.",
    "burn": "<strong>THERMAL FLASH BURNS:</strong><br>1. Flood the thermal surface under cool, non-pressurized water pathways for 10-20 minutes.<br>2. Remove jewelry and tight bands before tissue edema propagates.<br>3. Protect the area using non-adherent sterile protective sheets."
};

// DYNAMIC HEADER INJECTOR TEMPLATE GENERATOR
function initializePageStructure(activePage) {
    const host = document.getElementById("headerHost");
    if (!host) return;

    // Fetch static modular structural content
    fetch("header.html")
        .then(res => res.text())
        .then(html => {
            host.innerHTML = html;
            compileNavigationTabs(activePage);
        })
        .catch(err => console.error("Nav Framework Link Fail, compiling fallback matrix:", err));

    injectFloatingChatbotWidget();
    applyAccessibilitySettingsOnLoad();
}

function compileNavigationTabs(activePage) {
    const pages = {
        "index.html": '<i class="fa-solid fa-house mr-1.5"></i>Home Vector',
        "map.html": '<i class="fa-solid fa-map-location-dot mr-1.5"></i>Situation Map',
        "volunteer.html": '<i class="fa-solid fa-hands-holding-child mr-1.5"></i>Auxiliary Hub',
        "directory.html": '<i class="fa-solid fa-address-book mr-1.5"></i>Directory Node',
        "admin.html": '<i class="fa-solid fa-tower-radar mr-1.5"></i>Command Operations'
    };

    let desktopNav = "";
    let mobileNav = "";

    for (let filename in pages) {
        let isCurrent = filename === activePage;
        let deskClass = isCurrent ? "bg-red-600 text-white shadow-lg shadow-red-900/30" : "text-slate-400 hover:text-white hover:bg-slate-800/40";
        let mobClass = isCurrent ? "bg-red-600 text-white" : "text-slate-300 hover:bg-slate-800";

        desktopNav += `<a href="${filename}" class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${deskClass}">${pages[filename]}</a>`;
        mobileNav += `<a href="${filename}" class="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors ${mobClass}">${pages[filename]}</a>`;
    }

    const dContainer = document.getElementById("globalNavTabs");
    const mContainer = document.getElementById("mobileMenu");
    if (dContainer) dContainer.innerHTML = desktopNav;
    if (mContainer) mContainer.innerHTML = mobileNav;
}

function toggleMobileMenu() {
    const m = document.getElementById("mobileMenu");
    if(m) m.classList.toggle("hidden");
}

// INCLUSIVE ACCESSIBILITY MATRIX UTILITIES
function toggleAccessibility(actionType) {
    if (actionType === 'contrast') {
        document.body.classList.toggle('high-contrast-mode');
        localStorage.setItem("accessibility_contrast", document.body.classList.contains('high-contrast-mode'));
    } else if (actionType === 'font-plus') {
        let size = parseFloat(window.getComputedStyle(document.body).fontSize);
        if (size < 22) {
            document.body.style.fontSize = (size + 1) + "px";
            localStorage.setItem("accessibility_font", (size + 1) + "px");
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
}

// GIS GEOSPATIAL MAP COMPILING ENGINE
let mapAgent;
function initializeMapEngine() {
    const mapBox = document.getElementById("map");
    if (!mapBox) return;

    try {
        mapAgent = L.map('map', { zoomControl: false }).setView([38.0000, -97.0000], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapAgent);
        L.control.zoom({ position: 'topright' }).addTo(mapAgent);

        plotLiveMarkersOnMapContainer();
        renderSidebarTickerFeed();
    } catch (e) {
        console.error("GIS Fail. Processing backup offline visualization mesh framework: ", e);
    }
}

function plotLiveMarkersOnMapContainer() {
    if (!mapAgent) return;
    
    // Clear out preceding layers
    mapAgent.eachLayer((layer) => {
        if (layer instanceof L.Marker) mapAgent.removeLayer(layer);
    });

    const db = getDatabase();
    db.forEach(node => {
        let parts = node.geo.split(",");
        let lat = parseFloat(parts[0]) || 39.82;
        let lng = parseFloat(parts[1]) || -98.57;

        let markerColor = node.severity === "High" ? "red" : "orange";
        if (node.status === "RESOLVED") markerColor = "emerald";

        let pulseIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `<div class="relative flex items-center justify-center w-8 h-8">
                <span class="absolute inline-flex h-full w-full rounded-full bg-${markerColor}-500 opacity-40 ping-layer"></span>
                <div class="relative w-4 h-4 bg-${markerColor}-500 rounded-full border-2 border-white shadow-xl"></div>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        L.marker([lat, lng], { icon: pulseIcon }).addTo(mapAgent)
            .bindPopup(`<div class="text-slate-900 font-sans p-1"><p class="text-xs font-black uppercase text-red-600">${node.id}: ${node.type}</p><p class="text-[11px] font-medium mt-1">${node.desc}</p></div>`);
    });
}

function renderSidebarTickerFeed() {
    const stream = document.getElementById("incidentTickerStream");
    if (!stream) return;

    const db = getDatabase();
    stream.innerHTML = "";
    let pendingCount = 0;

    db.slice().reverse().forEach((node, i) => {
        if(node.status !== "RESOLVED") pendingCount++;
        let sevStyle = node.severity === 'High' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400';
        let statusStyle = node.status === 'PENDING' ? 'bg-slate-900 border border-red-500/20 text-red-400' : node.status === 'DISPATCHED' ? 'bg-blue-950 border border-blue-500/30 text-blue-400 animate-pulse' : 'bg-emerald-950 border border-emerald-500/30 text-emerald-400';

        let box = document.createElement("div");
        box.className = "p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5 stream-item";
        box.style.animationDelay = `${i * 60}ms`;
        box.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono text-slate-500 font-bold">${node.id}</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${sevStyle}">${node.severity}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-200">${node.type}</h4>
            <p class="text-[11px] text-slate-400 line-clamp-2">${node.desc}</p>
            <div class="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[9px]">
                <span class="text-slate-500 font-mono"><i class="fa-solid fa-crosshairs mr-1"></i>${node.geo}</span>
                <span class="px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${statusStyle}">${node.status}</span>
            </div>
        `;
        stream.appendChild(box);
    });

    document.getElementById("tickerCount").innerText = `${pendingCount} ACTIVE VECTORS`;
}

// INTAKE GEOLOCATION TELEMETRY INTERCEPTOR
function autoDetectLocation() {
    const geoInput = document.getElementById('incidentLocation');
    if(!geoInput) return;
    geoInput.placeholder = "Awaiting internal system tracking lock...";
    setTimeout(() => {
        let lat = (36.0000 + (Math.random() - 0.5) * 6).toFixed(4);
        let lng = (-115.0000 + (Math.random() - 0.5) * 12).toFixed(4);
        geoInput.value = `${lat}, ${lng}`;
    }, 1000);
}

// FORM TRANSACTION CAPTURE PIPELINE
function handleEmergencySubmit(e) {
    e.preventDefault();
    const type = document.getElementById('incidentType').value;
    const location = document.getElementById('incidentLocation').value;
    const desc = document.getElementById('incidentDesc').value;

    const token = `INC-${Math.floor(8000 + Math.random() * 2000)}`;
    const newLog = { id: token, type, geo: location, desc, status: "PENDING", severity: "High" };

    const db = getDatabase();
    db.push(newLog);
    saveDatabase(db);

    document.getElementById('emergencyReportForm').reset();
    alert(`INCIDENT QUEUED TRACE TOKEN ID: ${token}\nCommand grids synchronized across multi-page telemetry streams.`);
}

// FLOATING SOS OVERLAY COUNTDOWN SEQUENCER
let countdownTimer;
function triggerSOSCountdown() {
    const overlay = document.getElementById('sosOverlay');
    const display = document.getElementById('sosCountdown');
    let value = 3;

    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('opacity-100'), 10);
    display.innerText = value;

    countdownTimer = setInterval(() => {
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
    const overlay = document.getElementById('sosOverlay');
    overlay.classList.remove('opacity-100');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function executeSOSBroadcastVector() {
    const overlay = document.getElementById('sosOverlay');
    overlay.classList.remove('opacity-100');
    setTimeout(() => overlay.classList.add('hidden'), 300);

    const token = `SOS-${Math.floor(9000 + Math.random() * 1000)}`;
    const sosLog = {
        id: token,
        type: "CRITICAL LIFE THREAT VECTOR (SOS)",
        geo: "36.1699, -115.1398",
        desc: "Automated distress telemetry system bypass fired from high priority citizen terminal node.",
        status: "PENDING",
        severity: "High"
    };

    const db = getDatabase();
    db.push(sosLog);
    saveDatabase(db);
    alert(`CRITICAL SOS SYNCHRONIZED\nTracking index: ${token}. Regional intercept tactical squadrons have been authorized.`);
}

// ADMIN DASHBOARD RENDERING & MUTATIONS AGENT
function renderAdminDashboardMatrix() {
    const table = document.getElementById("adminIncidentTable");
    if (!table) return;

    const db = getDatabase();
    table.innerHTML = "";

    let total = db.length;
    let pending = db.filter(i => i.status === 'PENDING').length;
    let resolved = db.filter(i => i.status === 'RESOLVED').length;

    document.getElementById("metricTotal").innerText = total;
    document.getElementById("metricPending").innerText = pending;
    document.getElementById("metricResolved").innerText = resolved;

    db.slice().reverse().forEach(node => {
        let badgeStyle = node.status === 'PENDING' ? 'bg-slate-900 border border-red-500/20 text-red-400' : node.status === 'DISPATCHED' ? 'bg-blue-950 border border-blue-500/30 text-blue-400 animate-pulse' : 'bg-emerald-950 border border-emerald-500/30 text-emerald-400';
        let row = document.createElement("tr");
        row.className = "hover:bg-slate-900/30 border-b border-slate-900/60 transition-colors";
        row.innerHTML = `
            <td class="p-4 font-mono font-bold text-slate-400">${node.id}</td>
            <td class="p-4 font-bold text-slate-200">${node.type}</td>
            <td class="p-4 font-mono text-slate-400 text-xs"><i class="fa-solid fa-location-dot text-slate-600 mr-2"></i>${node.geo}</td>
            <td class="p-4"><span class="px-2.5 py-1 rounded-full font-bold uppercase text-[10px] tracking-wide ${badgeStyle}">${node.status}</span></td>
            <td class="p-4 text-right">
                ${node.status === 'PENDING' ? `<button onclick="mutateNodeState('${node.id}', 'DISPATCHED')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] uppercase rounded-lg transition-all tracking-wider">Authorize Dispatch</button>` : node.status === 'DISPATCHED' ? `<button onclick="mutateNodeState('${node.id}', 'RESOLVED')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase rounded-lg transition-all tracking-wider">Resolve Vector</button>` : `<span class="text-slate-500 text-xs italic"><i class="fa-solid fa-circle-check text-emerald-500 mr-1.5"></i>Deployment Complete</span>`}
            </td>
        `;
        table.appendChild(row);
    });
}

function mutateNodeState(id, targetState) {
    const db = getDatabase();
    let index = db.findIndex(item => item.id === id);
    if(index !== -1) {
        db[index].status = targetState;
        saveDatabase(db);
        renderAdminDashboardMatrix();
    }
}

// EXPERT MEDICAL TRUTHFUL AUTOMATED FLOATING AGENT WIDGET
function injectFloatingChatbotWidget() {
    const container = document.getElementById("chatbotHost");
    if (!container) return;

    container.innerHTML = `
        <div id="chatbotBox" class="w-80 sm:w-96 h-[460px] glass-panel border-slate-700/60 rounded-2xl flex flex-col shadow-2xl mb-4 hidden opacity-0 transition-all duration-300 transform translate-y-4">
            <div class="p-4 border-b border-slate-800 bg-slate-900/80 rounded-t-2xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <div>
                        <h4 class="text-xs font-black uppercase tracking-wider text-white">AI First Aid Assistant</h4>
                        <p class="text-[10px] text-cyan-400 font-medium">Automatic Crisis Knowledge Node</p>
                    </div>
                </div>
                <button onclick="toggleChatbotUI()" class="text-slate-500 hover:text-white p-1 text-sm"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="chatMessages" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed no-scrollbar">
                <div class="bg-slate-900/80 border border-slate-800 p-3 rounded-xl max-w-[85%] text-slate-300">System Link Confirmed. I am the triage first-aid automated tactical assistant. <strong>Select a target symptom baseline below</strong> or input critical keywords for direct mitigation parameters.</div>
            </div>
            <div class="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                <button onclick="triggerPresetReply('Severe Arterial Bleeding')" class="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold transition-all">Arterial Bleeding</button>
                <button onclick="triggerPresetReply('Compound Structural Fracture')" class="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold transition-all">Bone Fracture</button>
                <button onclick="triggerPresetReply('Toxic Smoke Inhalation')" class="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold transition-all">Smoke Inhalation</button>
                <button onclick="triggerPresetReply('Thermal Flash Burn Triage')" class="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold transition-all">Thermal Burn</button>
            </div>
            <div class="p-3 border-t border-slate-800 bg-slate-900/60 rounded-b-2xl flex gap-2">
                <input type="text" id="chatInput" placeholder="Input crisis keyword (e.g. burn, bleed)..." onkeydown="if(event.key === 'Enter') handleChatInputSubmit()" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-slate-200">
                <button onclick="handleChatInputSubmit()" class="px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs transition-colors"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
        <button onclick="toggleChatbotUI()" class="w-12 h-12 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl flex items-center justify-center shadow-2xl transition-all active:scale-95 group relative border border-cyan-400/20">
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-slate-950 rounded-full animate-ping"></span>
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-slate-950 rounded-full"></span>
            <i class="fa-solid fa-user-doctor text-lg group-hover:rotate-12 transition-transform"></i>
        </button>
    `;
}

function toggleChatbotUI() {
    const box = document.getElementById('chatbotBox');
    if(box.classList.contains('hidden')) {
        box.classList.remove('hidden');
        setTimeout(() => {
            box.classList.remove('opacity-0', 'translate-y-4');
            box.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    } else {
        box.classList.add('opacity-0', 'translate-y-4');
        box.classList.remove('opacity-100', 'translate-y-0');
        setTimeout(() => box.classList.add('hidden'), 300);
    }
}

function triggerPresetReply(text) {
    appendLogMessage(text, 'user');
    let key = 'bleeding';
    if(text.includes('Fracture')) key = 'fracture';
    if(text.includes('Smoke')) key = 'smoke';
    if(text.includes('Burn')) key = 'burn';

    setTimeout(() => appendLogMessage(MEDICAL_INTELLIGENCE_BASE[key], 'bot'), 400);
}

function handleChatInputSubmit() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;

    appendLogMessage(text, 'user');
    input.value = '';

    setTimeout(() => {
        let output = "<strong>QUERY CAPTURED:</strong> Systematic translation matched no exact verified triage rules. Input direct metrics keyword: <strong>'burn', 'bleeding', 'fracture', or 'smoke'</strong> for instruction extraction.";
        let norm = text.toLowerCase();
        for(let target in MEDICAL_INTELLIGENCE_BASE) {
            if(norm.includes(target)) { output = MEDICAL_INTELLIGENCE_BASE[target]; break; }
        }
        appendLogMessage(output, 'bot');
    }, 500);
}

function appendLogMessage(msg, role) {
    const space = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.className = role === 'user' ? "bg-cyan-950/60 border border-cyan-800 text-cyan-200 p-2.5 rounded-xl max-w-[85%] ml-auto text-right font-medium" : "bg-slate-900/90 border border-slate-800 text-slate-300 p-2.5 rounded-xl max-w-[85%] mr-auto text-left";
    wrapper.innerHTML = msg;
    space.appendChild(wrapper);
    space.scrollTop = space.scrollHeight;
}

// VOLUNTEER DISPATCH MOCK
function handleVolunteerSubmit(e) {
    e.preventDefault();
    document.getElementById('volunteerSuccess').classList.remove('hidden');
}

function resetVolunteerForm() {
    document.getElementById('volunteerSuccess').classList.add('hidden');
    document.getElementById('volunteerForm').reset();
}

// DIRECTORY LOCAL LIVE MATCH FILTERING
function filterDirectory() {
    const val = document.getElementById('directorySearch').value.toLowerCase();
    const nodes = document.querySelectorAll('.directory-node');
    nodes.forEach(n => {
        if(n.getAttribute('data-name').includes(val)) n.classList.remove('hidden');
        else n.classList.add('hidden');
    });
}

function triggerMockCall(node) {
    alert(`VOIP TUNNEL INITIALIZED\nRouting operational satellite connection matrix path to: ${node}`);
}