"use strict";

/* ============================================================
   SDRRS — volunteer.js
   Handles registration form + renders the volunteer roster table.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('volunteerForm');
  var successModal = document.getElementById('volSuccessModal');
  var successClose = document.getElementById('volSuccessClose');
  var tbody = document.getElementById('volunteerTableBody');

  function renderTable() {
    var volunteers = sdrrsGet(SDRRS_KEYS.VOLUNTEERS).slice().sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    if (volunteers.length === 0) {
      tbody.innerHTML = "<tr><td colspan=\"4\" class=\"text-center\" style=\"padding:30px;color:var(--text-muted);\">No volunteers registered yet \u2014 be the first.</td></tr>";
      return;
    }

    tbody.innerHTML = volunteers.map(function (v) {
      return "\n      <tr>\n        <td>".concat(v.name, "</td>\n        <td>").concat(v.location, "</td>\n        <td>").concat(v.skills.join(', '), "</td>\n        <td>").concat(v.availability, "</td>\n      </tr>\n    ");
    }).join('');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('volName').value.trim();
    var phone = document.getElementById('volPhone').value.trim();
    var email = document.getElementById('volEmail').value.trim();
    var location = document.getElementById('volLocation').value.trim();
    var availability = document.getElementById('volAvailability').value;
    var skills = Array.from(form.querySelectorAll('.chip-check input:checked')).map(function (i) {
      return i.value;
    });

    if (!name || !phone || !location || !availability || skills.length === 0) {
      showToast('Missing details', 'Please fill in all required fields and pick at least one skill.', '⚠️');
      return;
    }

    var volunteers = sdrrsGet(SDRRS_KEYS.VOLUNTEERS);
    volunteers.unshift({
      id: sdrrsId('VOL'),
      name: name,
      phone: phone,
      email: email,
      location: location,
      skills: skills,
      availability: availability,
      createdAt: Date.now()
    });
    sdrrsSet(SDRRS_KEYS.VOLUNTEERS, volunteers);
    successModal.classList.add('show');
    form.reset();
    renderTable();
  });
  successClose.addEventListener('click', function () {
    return successModal.classList.remove('show');
  });
  successModal.addEventListener('click', function (e) {
    if (e.target === successModal) successModal.classList.remove('show');
  });
  renderTable();
});
//# sourceMappingURL=volunteer.dev.js.map
