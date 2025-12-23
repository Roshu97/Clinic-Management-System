import { getAllPatientHistory, addPatientHistory } from '../../assets/firestore-patient-history-data.js';
import logger from '../../assets/logger.js';

document.addEventListener('DOMContentLoaded', () => {

  const tbody = document.querySelector('#patientHistoryTable tbody');
  const searchInput = document.querySelector('.search-input');

  // Modal elements
  const addHistoryModal = document.getElementById('addHistoryModal');
  const addNewHistoryBtn = document.getElementById('addNewHistoryBtn');
  const closeButton = addHistoryModal.querySelector('.close-button');
  const addHistoryForm = document.getElementById('addHistoryForm');

  let lastVisibleDoc = null;
  let allPatientHistory = [];

  const getPatientHistory = async (append = false) => {
    try {
      const { patientHistory, lastDoc } = await getAllPatientHistory(10, append ? lastVisibleDoc : null);
      lastVisibleDoc = lastDoc;
      if (append) {
        allPatientHistory = [...allPatientHistory, ...patientHistory];
      } else {
        allPatientHistory = patientHistory;
      }
      return allPatientHistory;
    } catch (e) {
      logger.error('Error fetching patient history from Firestore:', e);
      console.error('Error fetching patient history from Firestore:', e);
      return append ? allPatientHistory : [];
    }
  };

  const renderPatientHistory = (list) => {
    if (!tbody) return;
    if (!list.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No patient history found.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(h => {
      return `<tr>
        <td>${h.patientId}</td>
        <td>${h.patientName}</td>
        <td>${h.visitDate}</td>
        <td>${h.diagnosis}</td>
        <td><a class="btn primary" href="#">View Details</a></td>
      </tr>`;
    }).join('');
  };

  // Open modal
  addNewHistoryBtn?.addEventListener('click', () => {
    addHistoryModal.style.display = 'block';
  });

  // Close modal
  closeButton?.addEventListener('click', () => {
    addHistoryModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === addHistoryModal) {
      addHistoryModal.style.display = 'none';
    }
  });

  // Handle form submission
  addHistoryForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const patientId = document.getElementById('historyPatientId').value;
    const patientName = document.getElementById('historyPatientName').value;
    const visitDate = document.getElementById('visitDate').value;
    const diagnosis = document.getElementById('diagnosis').value;
    const notes = document.getElementById('notes').value;

    const newHistory = {
      patientId,
      patientName,
      visitDate,
      diagnosis,
      notes,
      timestamp: new Date().toISOString()
    };

    try {
      await addPatientHistory(newHistory);
      logger.info('Patient history added successfully:', newHistory);
      alert('Patient history added successfully!');
      addHistoryForm.reset();
      addHistoryModal.style.display = 'none';
      await getPatientHistory(); // Reload history to display new entry
      renderPatientHistory(allPatientHistory);
    } catch (error) {
      logger.error('Error adding patient history:', error);
      console.error('Error adding patient history:', error);
      alert('Failed to add patient history.');
    }
  });

  const loadInitialPatientHistory = async () => {
    await getPatientHistory();
    renderPatientHistory(allPatientHistory);
  };

  loadInitialPatientHistory();

  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const filtered = allPatientHistory.filter(h => 
      (h.patientName || '').toLowerCase().includes(q) || 
      (h.patientId || '').toLowerCase().includes(q)
    );
    renderPatientHistory(filtered);
  });

  const loadMoreHistoryBtn = document.getElementById('loadMoreHistoryBtn');
  loadMoreHistoryBtn?.addEventListener('click', async () => {
    await getPatientHistory(true);
    renderPatientHistory(allPatientHistory);
  });
});