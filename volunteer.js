/* ============================================================
   SDRRS — volunteer.js
   Handles registration form + renders the volunteer roster table.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('volunteerForm');
  const successModal = document.getElementById('volSuccessModal');
  const successClose = document.getElementById('volSuccessClose');
  const tbody = document.getElementById('volunteerTableBody');

  function renderTable(){
    const volunteers = sdrrsGet(SDRRS_KEYS.VOLUNTEERS).slice().sort((a,b) => b.createdAt - a.createdAt);
    if (volunteers.length === 0){
      tbody.innerHTML = `<tr><td colspan="4" class="text-center" style="padding:30px;color:var(--text-muted);">No volunteers registered yet — be the first.</td></tr>`;
      return;
    }
    tbody.innerHTML = volunteers.map(v => `
      <tr>
        <td>${v.name}</td>
        <td>${v.location}</td>
        <td>${v.skills.join(', ')}</td>
        <td>${v.availability}</td>
      </tr>
    `).join('');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('volName').value.trim();
    const phone = document.getElementById('volPhone').value.trim();
    const email = document.getElementById('volEmail').value.trim();
    const location = document.getElementById('volLocation').value.trim();
    const availability = document.getElementById('volAvailability').value;
    const skills = Array.from(form.querySelectorAll('.chip-check input:checked')).map(i => i.value);

    if (!name || !phone || !location || !availability || skills.length === 0){
      showToast('Missing details', 'Please fill in all required fields and pick at least one skill.', '⚠️');
      return;
    }

    const volunteers = sdrrsGet(SDRRS_KEYS.VOLUNTEERS);
    volunteers.unshift({
      id: sdrrsId('VOL'),
      name, phone, email, location, skills, availability,
      createdAt: Date.now()
    });
    sdrrsSet(SDRRS_KEYS.VOLUNTEERS, volunteers);

    successModal.classList.add('show');
    form.reset();
    renderTable();
  });

  successClose.addEventListener('click', () => successModal.classList.remove('show'));
  successModal.addEventListener('click', (e) => { if (e.target === successModal) successModal.classList.remove('show'); });

  renderTable();
});