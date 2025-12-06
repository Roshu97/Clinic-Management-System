import { getAllBills, addBill } from '../../assets/firestore-billing-data.js';
import logger from '../../assets/logger.js';

document.addEventListener('DOMContentLoaded', () => {

  const tbody = document.querySelector('#billingTable tbody');
  const searchInput = document.querySelector('.search-input');
  const addBillBtn = document.getElementById('addBillBtn');
  const addBillModal = document.getElementById('addBillModal');
  const closeButton = addBillModal.querySelector('.close-button');
  const addBillForm = document.getElementById('addBillForm');

  const getBills = async () => {
    try {
      return await getAllBills();
    } catch (e) {
      console.error('Error fetching bills from Firestore:', e);
      return [];
    }
  };

  const renderBills = (list) => {
    if (!tbody) return;
    if (!list.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No bills found.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(b => {
      return `<tr>
        <td>${b.id}</td>
        <td>${b.patientName}</td>
        <td>$${b.amount.toFixed(2)}</td>
        <td><span class="badge ${b.status === 'pending' ? 'warning' : b.status === 'paid' ? 'success' : 'danger'}">${b.status}</span></td>
        <td>${b.dueDate}</td>
        <td><a class="btn primary" href="#">View</a></td>
      </tr>`;
    }).join('');
  };

  addBillBtn?.addEventListener('click', () => {
    addBillModal.style.display = 'block';
  });

  closeButton?.addEventListener('click', () => {
    addBillModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == addBillModal) {
      addBillModal.style.display = 'none';
    }
  });

  addBillForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const patientName = document.getElementById('patientNameBill').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const status = document.getElementById('status').value;
    const dueDate = document.getElementById('dueDate').value;
    const services = document.getElementById('services').value;

    const billData = {
      patientName,
      amount,
      status,
      dueDate,
      services,
      createdAt: new Date().toISOString(),
    };

    try {
      await addBill(newBill);
      logger.info('Bill added successfully:', newBill);
      alert('Bill added successfully!');
      addBillForm.reset();
      addBillModal.style.display = 'none';
      loadBills(); // Reload bills to display new entry
    } catch (error) {
      logger.error('Error adding bill:', error);
      console.error('Error adding bill:', error);
      alert('Failed to add bill.');
    }
  });

  (async () => {
    const allBills = await getBills();
    renderBills(allBills);

    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const filtered = allBills.filter(b => 
        (b.patientName || '').toLowerCase().includes(q) || 
        (b.id || '').toLowerCase().includes(q)
      );
      renderBills(filtered);
    });
  })();
});