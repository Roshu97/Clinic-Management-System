const API_URL = window.location.origin + '/api';

// --- SECURITY & LOGOUT ---
const currentUser = JSON.parse(localStorage.getItem('user'));
if (!currentUser || currentUser.role !== 'pharmacist') {
    window.location.href = '../login.html';
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '../login.html';
}

// --- INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    fetchInventory();
    fetchPendingPrescriptions();
});

// Fetch and Display Inventory
async function fetchInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    try {
        const res = await fetch(`${API_URL}/pharmacy/inventory`);
        const items = await res.json();
        
        tbody.innerHTML = items.map(item => `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.stock} units</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    ${item.stock <= 5 ? 
                        '<span style="color:red; font-weight:bold;">Low Stock</span>' : 
                        '<span style="color:green;">In Stock</span>'}
                </td>
                <td>
                    <button class="btn-secondary" onclick="quickAddStock('${item._id}', '${item.name}')">
                        +10 Units
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Failed to load inventory:", err);
    }
}

function showAddStockModal() {
    document.getElementById('stockModal').classList.remove('hidden');
}

function closeStockModal() {
    document.getElementById('stockModal').classList.add('hidden');
}

// Add New Medicine to Database
document.getElementById('stockForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('medName').value,
        stock: parseInt(document.getElementById('medStock').value),
        price: parseFloat(document.getElementById('medPrice').value)
    };

    const res = await fetch(`${API_URL}/pharmacy/inventory/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("New medicine added successfully!");
        closeStockModal();
        fetchInventory();
    }
});

// --- PRESCRIPTION LOGIC ---
async function fetchPendingPrescriptions() {
    const tbody = document.getElementById('prescriptionTableBody');
    try {
        const res = await fetch(`${API_URL}/pharmacy/pending`);
        const patients = await res.json();

        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No prescriptions waiting.</td></tr>';
            return;
        }

        tbody.innerHTML = patients.map(p => `
            <tr>
                <td>#${p.token_number}</td>
                <td>${p.name}</td>
                <td style="color: var(--primary-color);"><strong>${p.medicines}</strong></td>
                <td>
                    <button class="btn-primary" onclick="dispenseMedication('${p.visitId}', '${p.medicines}')">
                        Mark as Dispensed
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

async function dispenseMedication(visitId, medicineText) {
    if (!confirm("Hand over medication and update inventory?")) return;

    try {
        const res = await fetch(`${API_URL}/pharmacy/dispense`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                visitId: visitId, 
                medicines: medicineText 
            })
        });

        if (res.ok) {
            alert("Success: Inventory updated and visit completed!");
            fetchInventory(); // Refresh the stock table
            fetchPendingPrescriptions(); // Refresh the pending list
        } else {
            const err = await res.json();
            alert("Error: " + err.error);
        }
    } catch (err) {
        console.error("Dispensing error:", err);
    }
}

// Simple Search Filter for Inventory Table
function filterInventory() {
    const input = document.getElementById('inventorySearch').value.toUpperCase();
    const rows = document.getElementById('inventoryTableBody').getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.getElementsByTagName('td')[0].textContent || row.getElementsByTagName('td')[0].innerText;
        row.style.display = text.toUpperCase().indexOf(input) > -1 ? "" : "none";
    }
}