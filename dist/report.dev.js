"use strict";

/* ============================================================
   SDRRS — report.js
   Handles the emergency reporting form on report.html
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('reportForm');
  var locBtn = document.getElementById('locBtn');
  var locStatus = document.getElementById('locStatus');
  var locCoords = document.getElementById('locCoords');
  var successModal = document.getElementById('successModal');
  var successClose = document.getElementById('successClose');
  var successId = document.getElementById('successId');
  var capturedCoords = null;
  locBtn.addEventListener('click', function () {
    locStatus.innerHTML = '<span class="spinner"></span> Detecting your location...';
    sdrrsLocate(function (lat, lng) {
      capturedCoords = {
        lat: lat,
        lng: lng
      };
      locStatus.textContent = 'Location captured ✓';
      locCoords.textContent = "LAT ".concat(lat.toFixed(5), "  LNG ").concat(lng.toFixed(5));
    }, function (msg) {
      locStatus.textContent = msg;
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var type = document.getElementById('type').value;
    var severityInput = form.querySelector('input[name="severity"]:checked');
    var desc = document.getElementById('desc').value.trim();

    if (!type || !severityInput || !desc) {
      showToast('Missing details', 'Please choose a type, severity, and description before submitting.', '⚠️');
      return;
    } // fall back to a default location if the person didn't share one,
    // so the report can still be saved and shown on the map.


    var coords = capturedCoords || {
      lat: 5.6037 + (Math.random() - 0.5) * 0.05,
      lng: -0.1870 + (Math.random() - 0.5) * 0.05
    };
    var reports = sdrrsGet(SDRRS_KEYS.REPORTS);
    var newReport = {
      id: sdrrsId('RPT'),
      type: type,
      severity: severityInput.value,
      desc: desc,
      reporter: document.getElementById('name').value.trim() || 'Anonymous',
      lat: coords.lat,
      lng: coords.lng,
      status: 'pending',
      urgent: severityInput.value === 'high',
      createdAt: Date.now()
    };
    reports.unshift(newReport);
    sdrrsSet(SDRRS_KEYS.REPORTS, reports);
    successId.textContent = newReport.id;
    successModal.classList.add('show');
    form.reset();
    locStatus.textContent = 'Location not shared yet';
    locCoords.textContent = '';
    capturedCoords = null;
  });
  successClose.addEventListener('click', function () {
    return successModal.classList.remove('show');
  });
  successModal.addEventListener('click', function (e) {
    if (e.target === successModal) successModal.classList.remove('show');
  });
});
//# sourceMappingURL=report.dev.js.map
