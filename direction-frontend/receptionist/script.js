const API_URL = 'http://localhost:3000/api';

// --- SECURITY CHECK ---
const currentUser = JSON.parse(localStorage.getItem('user'));

if (!currentUser || currentUser.role !== 'receptionist') {
    alert("Access Denied. Please login as Receptionist.");
    window.location.href = '../login.html';
}

// --- LOGOUT LOGIC ---
function logout() {
    localStorage.removeItem('user');
    window.location.href = '../login.html';
}

const logoutButton = document.getElementById('logoutBtn');
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

// --- ADD PATIENT FORM ---
document.getElementById('patientForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        contact: document.getElementById('contact').value,
        history: document.getElementById('history').value
    };

    try {
        const response = await fetch(`${API_URL}/patient/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showToken(data.token, data.patientName);
            // Optional: Refresh billing list just in case
            fetchPendingBills(); 
        } else {
            alert('Error: ' + data.error);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Server is offline or unreachable.');
    }
});

function showToken(token, name) {
    const tokenCard = document.getElementById('tokenCard');
    document.getElementById('displayToken').innerText = `#${token}`;
    document.getElementById('displayName').innerText = name;
    tokenCard.classList.remove('hidden');
    document.getElementById('patientForm').reset();
}

function resetForm() {
    document.getElementById('tokenCard').classList.add('hidden');
}

// --- BILLING LOGIC ---

// 1. Fetch patients ready for billing
async function fetchPendingBills() {
    const tbody = document.getElementById('billingTableBody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

    try {
        const res = await fetch(`${API_URL}/billing/pending`);
        const patients = await res.json();

        tbody.innerHTML = '';
        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No pending bills.</td></tr>';
            return;
        }

        patients.forEach(p => {
            const row = `
                <tr>
                    <td>#${p.token_number}</td>
                    <td>${p.name}</td>
                    <td>
                        <button class="btn-success" onclick="generateBill(${p.visitId}, '${p.name}', ${p.token_number})">
                            Generate Bill ($50)
                        </button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) {
        console.error(err);
    }
}

// 2. Generate the bill
async function generateBill(visitId, name, token) {
    if(!confirm(`Generate bill of $50 for ${name}?`)) return;

    try {
        const res = await fetch(`${API_URL}/billing/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitId: visitId, amount: 50.00 })
        });

        if(res.ok) {
            alert("Bill Generated Successfully!");
            
            // Ask to print
            if(confirm("Do you want to print the receipt?")) {
                printBill(name, 50, token);
            }

            fetchPendingBills(); // Refresh list to remove this patient
        }
    } catch (err) {
        alert("Error generating bill");
    }
}

// 3. Print Function
function printBill(patientName, amount, token) {
    const billContent = `
        <div style="text-align:center; font-family: sans-serif; padding: 20px;">
            <h2>Direction Clinic</h2>
            <p>Receipt</p>
            <hr>
            <div style="text-align:left; margin: 20px 0;">
                <p><strong>Patient:</strong> ${patientName}</p>
                <p><strong>Token:</strong> #${token}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <hr>
            <h3>Total Paid: $${amount}</h3>
            <hr>
            <p>Thank you for visiting!</p>
        </div>
    `;
    
    const printWindow = window.open('', '', 'width=400,height=600');
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
}

// Auto-load on startup
window.onload = function() {
    fetchPendingBills();
};