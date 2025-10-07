// Render patients from shared localStorage and support search
  import { getAllPatients, addPatient } from '../../assets/firestore-patient-data.js';
import logger from '../../assets/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  const addPatientBtn = document.getElementById('addPatientBtn');
  const addPatientModal = document.getElementById('addPatientModal');
  const closeButton = addPatientModal.querySelector('.close-button');
  const addPatientForm = document.getElementById('addPatientForm');

  const getPatients = async () => {
    try {
      return await getAllPatients();
    } catch (e) {
      console.error('Error fetching patients from Firestore:', e);
      return [];
    }
  };

  const render = (list) => {
    if (!tbody) return;
    if (!list.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No patients found.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(p => {
      return `<tr>
        <td>${p.name}</td>
        <td>${p.age || '—'}</td>
        <td>${p.gender || '—'}</td>
        <td>${p.phone || '—'}</td>
        <td><a class="btn" href="#">View</a></td>
      </tr>`;
    }).join('');
  };

  addPatientBtn?.addEventListener('click', () => {
    addPatientModal.style.display = 'block';
  });

  closeButton?.addEventListener('click', () => {
    addPatientModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == addPatientModal) {
      addPatientModal.style.display = 'none';
    }
  });

  addPatientForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('patientName').value;
    const age = document.getElementById('patientAge').value;
    const gender = document.getElementById('patientGender').value;
    const phone = document.getElementById('patientPhone').value;

    const patientData = {
      name,
      age: parseInt(age),
      gender,
      phone,
      registeredAt: new Date().toISOString(),
    };

    try {
      await addPatient(newPatient);
      logger.info('Patient added successfully:', newPatient);
      alert('Patient added successfully!');
      addPatientForm.reset();
      addPatientModal.style.display = 'none';
      loadPatients(); // Reload patients to display new entry
    } catch (error) {
      logger.error('Error adding patient:', error);
      console.error('Error adding patient:', error);
      alert('Failed to add patient.');
    }
  });

  (async () => {
    const all = await getPatients();
    render(all);
    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const filtered = all.filter(p => (p.name || '').toLowerCase().includes(q) || (p.phone || '').toLowerCase().includes(q));
      render(filtered);
    });
  })();
});