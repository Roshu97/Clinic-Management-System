// Profile dropdown + Tabs + Modal interactions
document.addEventListener('DOMContentLoaded', () => {
  // Profile dropdown
  const profile = document.getElementById('profileMenu');
  const avatarBtn = document.getElementById('avatarBtn');
  const toggleProfile = () => profile?.classList.toggle('open');
  avatarBtn?.addEventListener('click', (e) => { e.stopPropagation(); toggleProfile(); });
  document.addEventListener('click', () => profile?.classList.remove('open'));

  // Shared storage helpers
  const LS_KEYS = { patients: 'clf_patients', queue: 'clf_queue' };
  const getJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const getPatients = () => getJSON(LS_KEYS.patients, []);
  const setPatients = (list) => setJSON(LS_KEYS.patients, list);
  const getQueue = () => getJSON(LS_KEYS.queue, []);
  const setQueue = (list) => setJSON(LS_KEYS.queue, list);

  // Tabs
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const panels = {
    token: document.getElementById('panel-token'),
    registration: document.getElementById('panel-registration'),
    billing: document.getElementById('panel-billing'),
  };

  const activateTab = (name) => {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === name));
    Object.entries(panels).forEach(([key, el]) => el?.classList.toggle('hidden', key !== name));
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // Sidebar links can switch tabs too
  document.querySelectorAll('[data-tab-link]')?.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const name = link.getAttribute('data-tab-link');
      activateTab(name);
    });
  });

  // Backend helpers (fallback to localStorage)
  const API_BASE = 'http://localhost:3001';
  const apiPost = async (path, body) => {
    try {
      const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch { return null; }
  };
  const apiGet = async (path) => {
    try { const res = await fetch(`${API_BASE}${path}`); if (!res.ok) throw new Error('HTTP ' + res.status); return await res.json(); } catch { return null; }
  };

  // Registration: validation + photo capture + persistence
  const registerBtn = document.getElementById('registerPatientBtn');
  const readFileAsDataURL = (file) => new Promise((resolve) => { const fr = new FileReader(); fr.onload = () => resolve(fr.result); fr.onerror = () => resolve(null); fr.readAsDataURL(file); });
  const photoInput = document.getElementById('pphoto');
  const photoPreview = document.getElementById('photoPreview');

  photoInput?.addEventListener('change', async () => {
    const file = photoInput.files?.[0];
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      if (dataUrl) { photoPreview.src = dataUrl; photoPreview.style.display = 'block'; }
    } else {
      photoPreview.style.display = 'none';
      photoPreview.src = '';
    }
  });

  registerBtn?.addEventListener('click', async () => {
    const name = document.getElementById('pname')?.value?.trim();
    const ageVal = document.getElementById('page')?.value || '';
    const age = parseInt(ageVal, 10);
    const gender = document.getElementById('pgender')?.value || '';
    const phone = document.getElementById('pphone')?.value?.trim() || '';
    const address = document.getElementById('paddress')?.value?.trim() || '';
    const pid = document.getElementById('pid')?.value?.trim() || '';
    const phoneOk = /^[0-9\-\s]+$/.test(phone);
    if (!name || !pid || !gender || !Number.isFinite(age) || age < 0 || !phoneOk) {
      alert('Please fill all required fields with valid values.');
      return;
    }
    const list = getPatients();
    const exists = list.some(p => p.pid === pid && pid);
    const finalPid = exists ? `${pid}-${Date.now()}` : (pid || `CLF-${Date.now()}`);
    let photoData = null;
    const file = photoInput?.files?.[0];
    if (file) photoData = await readFileAsDataURL(file);
    const newRecord = { pid: finalPid, name, age, gender, phone, address, photo: photoData, registeredAt: new Date().toISOString() };

    // Try backend
    const saved = await apiPost('/patients', newRecord);
    if (saved && saved.id) {
      alert('Patient registered (server).');
    } else {
      // Fallback to localStorage
      setPatients([newRecord, ...list]);
      alert('Patient registered (local).');
    }
    // Reset form
    document.querySelector('form.form')?.reset();
    photoPreview.style.display = 'none';
    photoPreview.src = '';
    // Refresh modal list
    renderModalPatients();
    activateTab('token');
  });

  // Queue modal: render patients and add to queue
  const queueModal = document.getElementById('queueModal');
  const modalBody = document.getElementById('modalPatientsTbody');
  const openQueueModalBtn = document.getElementById('openQueueModal');
  const closeQueueModalBtn = document.getElementById('closeQueueModal');

  const renderModalPatients = async () => {
    if (!modalBody) return;
    const apiList = await apiGet('/patients');
    const patients = apiList ?? getPatients();
    if (!patients.length) {
      modalBody.innerHTML = '<tr class="empty-row"><td colspan="3">No patients found. Register a patient first.</td></tr>';
      return;
    }
    modalBody.innerHTML = patients.map(p => {
      const lastVisit = (p.registeredAt || '').slice(0, 10);
      return `<tr>
        <td>${p.name}</td>
        <td>${lastVisit || '—'}</td>
        <td><button class="btn primary" data-action="add-to-queue" data-pid="${p.pid}" data-name="${p.name}">Add</button></td>
      </tr>`;
    }).join('');
  };

  const addToQueue = async (pid, name) => {
    const queue = getQueue();
    const nextTokenNum = 100 + queue.length + 1;
    const token = `A${nextTokenNum}`;
    const entry = { token, patientId: pid, patientName: name, doctorName: '—', status: 'Waiting', createdAt: Date.now() };
    const saved = await apiPost('/queue', entry);
    if (saved && saved.id) {
      alert(`Added ${name} to queue (server) with token ${token}`);
    } else {
      queue.push(entry);
      setQueue(queue);
      alert(`Added ${name} to queue (local) with token ${token}`);
    }
    renderQueueTable(); // Refresh queue table after adding patient
  };

  openQueueModalBtn?.addEventListener('click', () => {
    renderModalPatients();
    queueModal?.classList.remove('hidden');
  });
  closeQueueModalBtn?.addEventListener('click', () => {
    queueModal?.classList.add('hidden');
  });

  modalBody?.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.matches('[data-action="add-to-queue"]')) {
      const pid = t.getAttribute('data-pid');
      const name = t.getAttribute('data-name');
      addToQueue(pid, name);
    }
  });

  const queueTableBody = document.querySelector('.queue-table tbody');

  const renderQueueTable = () => {
    if (!queueTableBody) return;
    const queue = getQueue();
    if (!queue.length) {
      queueTableBody.innerHTML = '<tr class="empty-row"><td colspan="5">No patients in queue.</td></tr>';
      return;
    }
    queueTableBody.innerHTML = queue.map(entry => {
      const statusClass = entry.status === 'Waiting' ? 'secondary' : 'warning';
      return `<tr>
        <td>${entry.token}</td>
        <td>${entry.patientName}</td>
        <td>${entry.doctorName}</td>
        <td><span class="badge ${statusClass}">${entry.status}</span></td>
        <td><a class="btn" href="#" data-action="remove-from-queue" data-token="${entry.token}">Remove</a></td>
      </tr>`;
    }).join('');
  };

  queueTableBody?.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.matches('[data-action="remove-from-queue"]')) {
      const tokenToRemove = t.getAttribute('data-token');
      if (tokenToRemove) {
        let queue = getQueue();
        queue = queue.filter(entry => entry.token !== tokenToRemove);
        setQueue(queue);
        renderQueueTable();
        alert(`Token ${tokenToRemove} removed from queue.`);
      }
    }
  });

  let currentServingPatient = null;

  const renderNowServing = (token, patientName, doctorName) => {
    if (nowServingToken) nowServingToken.textContent = token || '—';
    if (nowServingPatient) nowServingPatient.textContent = patientName || '—';
    if (nowServingDoctor) nowServingDoctor.textContent = doctorName || '—';
    currentServingPatient = token ? { token, patientName, doctorName } : null;
    renderQueueTable(); // Refresh queue table after serving patient
  };

  callNextBtn?.addEventListener('click', async () => {
    const queue = getQueue();
    if (queue.length > 0) {
      const nextPatient = queue.shift(); // Remove the first patient from the queue
      setQueue(queue); // Update the queue in local storage
      renderNowServing(nextPatient.token, nextPatient.patientName, nextPatient.doctorName);
      alert(`Now serving: ${nextPatient.patientName} with token ${nextPatient.token}`);
    } else {
      alert('Patient queue is empty.');
      renderNowServing(null, null, null); // Clear now serving display
    }
  });

  const pauseServingBtn = document.getElementById('pauseServingBtn');
  const completeServingBtn = document.getElementById('completeServingBtn');

  pauseServingBtn?.addEventListener('click', () => {
    if (currentServingPatient) {
      const queue = getQueue();
      queue.unshift(currentServingPatient); // Add back to the beginning of the queue
      setQueue(queue);
      alert(`${currentServingPatient.patientName} with token ${currentServingPatient.token} has been paused and returned to queue.`);
      renderNowServing(null, null, null);
    } else {
      alert('No patient is currently being served.');
    }
  });

  completeServingBtn?.addEventListener('click', () => {
    if (currentServingPatient) {
      alert(`${currentServingPatient.patientName} with token ${currentServingPatient.token} has completed their visit.`);
      renderNowServing(null, null, null);
    } else {
      alert('No patient is currently being served.');
    }
  });

  const billingTbody = document.querySelector('#panel-billing tbody');

  const getBills = () => getJSON('clf_bills', [
    { id: 'B-001', patient: 'John Carter', amount: '80.00', status: 'Pending' },
    { id: 'B-002', patient: 'Ana Gomez', amount: '120.00', status: 'Awaiting' },
  ]);
  const setBills = (list) => setJSON('clf_bills', list);

  const renderBills = () => {
    if (!billingTbody) return;
    const bills = getBills();
    if (!bills.length) {
      billingTbody.innerHTML = '<tr class="empty-row"><td colspan="5">No bills found.</td></tr>';
      return;
    }
    billingTbody.innerHTML = bills.map(bill => {
      const statusClass = bill.status === 'Pending' ? 'warning' : 'secondary';
      return `<tr>
        <td>${bill.id}</td>
        <td>${bill.patient}</td>
        <td>$${bill.amount}</td>
        <td><span class="badge ${statusClass}">${bill.status}</span></td>
        <td>
          <a class="btn primary" data-action="collect-bill" data-id="${bill.id}" href="#">Collect</a>
          <a class="btn" data-action="send-reminder" data-id="${bill.id}" href="#">Send Reminder</a>
        </td>
      </tr>`;
    }).join('');
  };

  billingTbody?.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.matches('[data-action="collect-bill"]')) {
      const billId = t.getAttribute('data-id');
      if (billId) {
        let bills = getBills();
        bills = bills.filter(bill => bill.id !== billId);
        setBills(bills);
        renderBills();
        alert(`Bill ${billId} collected.`);
      }
    } else if (t && t.matches('[data-action="send-reminder"]')) {
      const billId = t.getAttribute('data-id');
      if (billId) {
        alert(`Reminder sent for bill ${billId}.`);
      }
    }
  });

  // Initial renders
  renderQueueTable();
  renderBills();
});