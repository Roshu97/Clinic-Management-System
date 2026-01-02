const API_URL = window.location.origin + '/api';

// --- SECURITY CHECK ---
const currentUser = JSON.parse(localStorage.getItem('user'));

// 1. Check if user is logged in AND is a doctor
if (!currentUser || currentUser.role !== 'doctor') {
    alert("Access Denied. Please login as a Doctor.");
    window.location.href = 'login.html'; // Kick them out
}

// 2. Update the UI with the doctor's name
document.addEventListener('DOMContentLoaded', () => {
    // Look for an element with class .user-info or id userDisplay to show name
    const userDisplay = document.querySelector('.user-info span');
    if(userDisplay) userDisplay.innerText = currentUser.name;
});

// 3. Logout Function
function logout() {
    localStorage.removeItem('user'); // Clear session
    window.location.href = '../login.html';
}

// Attach logout to your button (add onclick="logout()" in HTML or use this)
const logoutBtn = document.querySelector('.btn-logout');
if(logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// 1. Fetch Waiting Queue
async function fetchQueue() {
    const tableBody = document.getElementById('queueTableBody');
    // Get the token we saved during login
    const token = localStorage.getItem('token'); 

    try {
        const response = await fetch(`${API_URL}/doctor/queue`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // THE IMPORTANT PART
                'Content-Type': 'application/json'
            }
        });

        // If the token is expired or missing, send them back to login
        if (response.status === 401 || response.status === 400) {
            alert("Session expired. Please login again.");
            window.location.href = '../login.html';
            return;
        }

        const patients = await response.json();
        renderTable(patients);
    } catch (error) {
        console.error("Error fetching queue", error);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Connection Failed</td></tr>';
    }
}

// 2. Render Table
function renderTable(patients) {
    const tableBody = document.getElementById('queueTableBody');
    tableBody.innerHTML = '';

    if (patients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No patients waiting.</td></tr>';
        return;
    }

    patients.forEach(p => {
        // Note: The backend sends 'visitId', 'token', 'name', etc.
        const row = `
            <tr>
                <td><strong>#${p.token}</strong></td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.history}</td>
                <td>
                    <button class="btn-primary" 
                        onclick="openPrescription('${p.name}', ${p.token}, ${p.visitId})">
                        Consult
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// 3. Open Modal
function openPrescription(name, token, visitId) {
    console.log("Data Received:", name, token, visitId); 

    document.getElementById('modalPatientName').innerText = name;
    document.getElementById('modalToken').innerText = token;
    
    document.getElementById('modalVisitId').value = visitId;

    document.getElementById('prescriptionModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('prescriptionModal').classList.add('hidden');
}

// 4. Submit Prescription
document.getElementById('prescriptionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const visitId = document.getElementById('modalVisitId').value;
    const diagnosis = document.getElementById('diagnosis').value; // Optional usage
    const medicines = document.getElementById('medicines').value;

    const payload = {
        visitId: visitId,
        medicines: medicines,
        notes: diagnosis
    };

    try {
        const response = await fetch(`${API_URL}/doctor/prescribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Prescription Saved!');
            closeModal();
            fetchQueue(); // Refresh the list to remove the treated patient
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting prescription:', error);
        alert('Failed to save prescription.');
    }
});
async function searchHistory() {
    const keyword = document.getElementById('searchInput').value;
    if(!keyword) return alert("Please enter a name");

    const resultDiv = document.getElementById('searchResults');
    resultDiv.innerHTML = "Searching...";

    try {
        const res = await fetch(`${API_URL}/patient/search?keyword=${keyword}`);
        const history = await res.json();

        if (history.length === 0) {
            resultDiv.innerHTML = "<p>No records found.</p>";
            return;
        }

        let html = '<ul style="list-style: none; padding: 0;">';
        history.forEach(h => {
            // Format date nicely
            const date = new Date(h.visit_date).toLocaleDateString();
            html += `
                <li style="background: white; padding: 10px; margin-bottom: 5px; border-left: 4px solid #0056b3;">
                    <strong>${h.name} (${date})</strong><br>
                    <small>Meds: ${h.medicines || 'No prescription'}</small><br>
                    <small>Notes: ${h.notes || '-'}</small>
                </li>
            `;
        });
        html += '</ul>';
        resultDiv.innerHTML = html;

    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = "Error fetching history.";
    }
}


window.onclick = function(event) {
    const modal = document.getElementById('prescriptionModal');
    if (event.target == modal) {
        closeModal();
    }
}

// doctor_script.js

async function checkMedStock() {
    const query = document.getElementById('medSearch').value;
    const resultDiv = document.getElementById('stockCheckResult');
    
    if (!query) return;

    try {
        const res = await fetch(`${API_URL}/pharmacy/inventory`);
        const inventory = await res.json();
        
        // Find medicine that matches the query
        const item = inventory.find(i => i.name.toLowerCase().includes(query.toLowerCase()));

        if (item) {
            const color = item.stock > 0 ? 'green' : 'red';
            resultDiv.innerHTML = `<span style="color: ${color}; font-weight: bold;">
                ${item.name}: ${item.stock} in stock ($${item.price}/unit)
            </span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: orange;">Medicine not found in inventory.</span>`;
        }
    } catch (err) {
        console.error("Stock check failed:", err);
    }
}
// Initial Load
fetchQueue();