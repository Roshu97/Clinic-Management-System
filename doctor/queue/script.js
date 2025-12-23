// Render queue from backend or localStorage and allow status updates
import { addToken } from '../../assets/firestore-token-data.js';
import logger from '../../assets/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:3001';
  const LS_QUEUE = 'clf_queue';
  const LS_PATIENTS = 'clf_patients';
  const tbody = document.getElementById('queueTbody');

  // Modal elements
  const addTokenModal = document.getElementById('addTokenModal');
  const addNewTokenBtn = document.getElementById('addNewTokenBtn');
  const closeButton = addTokenModal.querySelector('.close-button');
  const addTokenForm = document.getElementById('addTokenForm');

  const getLS = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };
  const setLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const fetchJSON = async (url, opts) => {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch { return null; }
  };

  const mapBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'waiting') return '<span class="badge secondary">Waiting</span>';
    if (s === 'serving') return '<span class="badge success">Serving</span>';
    if (s === 'paused') return '<span class="badge warning">Paused</span>';
    if (s === 'completed') return '<span class="badge">Completed</span>';
    return '<span class="badge">—</span>';
  };

  const render = (list) => {
    if (!tbody) return;
    if (!list?.length) { tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No queue entries.</td></tr>'; return; }
    tbody.innerHTML = list.map((q) => {
      return `<tr data-id="${q.id ?? ''}" data-token="${q.token}">
        <td>${q.token}</td>
        <td>${q.patientName || q.patientId}</td>
        <td>${q.doctorName || '—'}</td>
        <td>
          <select class="status-select">
            <option ${q.status==='Waiting'?'selected':''}>Waiting</option>
            <option ${q.status==='Serving'?'selected':''}>Serving</option>
            <option ${q.status==='Paused'?'selected':''}>Paused</option>
            <option ${q.status==='Completed'?'selected':''}>Completed</option>
          </select>
        </td>
        <td><button class="btn primary" data-action="update">Update</button></td>
      </tr>`;
    }).join('');
  };

  const loadQueue = async () => {
    const apiData = await fetchJSON(`${API_BASE}/queue`);
    if (apiData) { render(apiData); return { source: 'api', data: apiData }; }
    const lsData = getLS(LS_QUEUE, []);
    render(lsData);
    return { source: 'ls', data: lsData };
  };

  const updateStatus = async (row, newStatus) => {
    const id = row.getAttribute('data-id');
    const token = row.getAttribute('data-token');
    // Try backend first
    if (id) {
      const updated = await fetchJSON(`${API_BASE}/queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (updated) return true;
    }
    // Fallback to localStorage
    const list = getLS(LS_QUEUE, []);
    const idx = list.findIndex(q => q.token === token);
    if (idx !== -1) { list[idx].status = newStatus; setLS(LS_QUEUE, list); return true; }
    return false;
  };

  tbody?.addEventListener('click', async (e) => {
    const t = e.target;
    if (t && t.matches('[data-action="update"]')) {
      const row = t.closest('tr');
      const sel = row.querySelector('.status-select');
      const status = sel.value;
      const ok = await updateStatus(row, status);
      if (ok) alert('Status updated');
    }
  });

  // Open modal
  addNewTokenBtn?.addEventListener('click', () => {
    addTokenModal.style.display = 'block';
  });

  // Close modal
  closeButton?.addEventListener('click', () => {
    addTokenModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === addTokenModal) {
      addTokenModal.style.display = 'none';
    }
  });

  // Handle form submission
  addTokenForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const patientId = document.getElementById('patientId').value;
    const doctorName = document.getElementById('doctorName').value;
    const token = Math.random().toString(36).substring(2, 8).toUpperCase(); // Simple token generation

    const newToken = {
      token: token,
      patientId: patientId,
      doctorName: doctorName,
      status: 'Waiting',
      timestamp: new Date().toISOString()
    };

    try {
      await addToken(newToken);
      logger.info('Token generated and added successfully:', newToken);
      alert('Token generated and added successfully!');
      addTokenForm.reset();
      addTokenModal.style.display = 'none';
      loadQueue(); // Reload queue to display new token
    } catch (error) {
      logger.error('Error adding token:', error);
      console.error('Error adding token:', error);
      alert('Failed to add token.');
    }
  });

  loadQueue();
});