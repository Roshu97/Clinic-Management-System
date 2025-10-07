import { getAllPrescriptions, addPrescription } from '../../assets/firestore-prescription-data.js';
import logger from '../../assets/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  const addPrescriptionBtn = document.getElementById('addPrescriptionBtn');
  const addPrescriptionModal = document.getElementById('addPrescriptionModal');
  const closeButton = addPrescriptionModal.querySelector('.close-button');
  const addPrescriptionForm = document.getElementById('addPrescriptionForm');

  const getPrescriptions = async () => {
    try {
      return await getAllPrescriptions();
    } catch (e) {
      console.error('Error fetching prescriptions from Firestore:', e);
      return [];
    }
  };

  const renderPrescriptions = (list) => {
    if (!tbody) return;
    if (!list.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No prescriptions found.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(p => {
      return `<tr>
        <td>${p.id}</td>
        <td>${p.patientId}</td>
        <td>${p.medication}</td>
        <td>${p.dosage}</td>
        <td><span class="badge warning">Pending</span></td>
        <td><a class="btn primary" href="#">Review</a></td>
      </tr>`;
    }).join('');
  };

  addPrescriptionBtn?.addEventListener('click', () => {
    addPrescriptionModal.style.display = 'block';
  });

  closeButton?.addEventListener('click', () => {
    addPrescriptionModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == addPrescriptionModal) {
      addPrescriptionModal.style.display = 'none';
    }
  });

  addPrescriptionForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const patientId = document.getElementById('patientId').value;
    const medication = document.getElementById('medication').value;
    const dosage = document.getElementById('dosage').value;
    const frequency = document.getElementById('frequency').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const notes = document.getElementById('notes').value;

    const prescriptionData = {
      patientId,
      medication,
      dosage,
      frequency,
      startDate,
      endDate,
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      await addPrescription(newPrescription);
      logger.info('Prescription added successfully:', newPrescription);
      alert('Prescription added successfully!');
      addPrescriptionForm.reset();
      addPrescriptionModal.style.display = 'none';
      loadPrescriptions(); // Reload prescriptions to display new entry
    } catch (error) {
      logger.error('Error adding prescription:', error);
      console.error('Error adding prescription:', error);
      alert('Failed to add prescription.');
    }
  });

  (async () => {
    const allPrescriptions = await getPrescriptions();
    renderPrescriptions(allPrescriptions);

    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const filtered = allPrescriptions.filter(p => 
        (p.patientId || '').toLowerCase().includes(q) || 
        (p.medication || '').toLowerCase().includes(q)
      );
      renderPrescriptions(filtered);
    });
  })();
});