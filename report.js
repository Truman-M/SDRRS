/* ============================================================
   SDRRS — report.js
   Handles the emergency reporting form on report.html
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reportForm');
  const locBtn = document.getElementById('locBtn');
  const locStatus = document.getElementById('locStatus');
  const locCoords = document.getElementById('locCoords');
  const successModal = document.getElementById('successModal');
  const successClose = document.getElementById('successClose');
  const successId = document.getElementById('successId');

  let capturedCoords = null;

  locBtn.addEventListener('click', () => {
    locStatus.innerHTML = '<span class="spinner"></span> Detecting your location...';
    sdrrsLocate(
      (lat, lng) => {
        capturedCoords = { lat, lng };
        locStatus.textContent = 'Location captured ✓';
        locCoords.textContent = `LAT ${lat.toFixed(5)}  LNG ${lng.toFixed(5)}`;
      },
      (msg) => { locStatus.textContent = msg; }
    );
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const severityInput = form.querySelector('input[name="severity"]:checked');
    const desc = document.getElementById('desc').value.trim();

    if (!type || !severityInput || !desc){
      showToast('Missing details', 'Please choose a type, severity, and description before submitting.', '⚠️');
      return;
    }

    // fall back to a default location if the person didn't share one,
    // so the report can still be saved and shown on the map.
    const coords = capturedCoords || { lat: 5.6037 + (Math.random()-0.5)*0.05, lng: -0.1870 + (Math.random()-0.5)*0.05 };

    const reports = sdrrsGet(SDRRS_KEYS.REPORTS);
    const newReport = {
      id: sdrrsId('RPT'),
      type,
      severity: severityInput.value,
      desc,
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

  successClose.addEventListener('click', () => successModal.classList.remove('show'));
  successModal.addEventListener('click', (e) => { if (e.target === successModal) successModal.classList.remove('show'); });
});