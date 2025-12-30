🏥 Direction CMS - Clinic Management System
A full-stack, role-based Clinic Management System designed to streamline patient registration, medical consultations, billing, and pharmacy inventory management. Optimized for cloud deployment on Render.

🌟 Features
🔐 Multi-User Authentication: Role-based access for Admin, Doctor, Receptionist, and Pharmacist.

📈 Real-time Analytics: Revenue trends and daily reports using Chart.js.

💉 Smart Pharmacy: Real-time stock verification during prescription and automatic inventory deduction.

📋 Automated Workflow: Seamless transition from Registration → Consultation → Billing → Dispensing.

📱 Responsive Design: Modern UI built with Flexbox/Grid for all device sizes.

🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+).

Backend: Node.js, Express.js (v5.0+ compatible).

Database: MongoDB Atlas (Cloud).

Deployment: Render.com.

🚀 Live Deployment (Render)
1. Environment Variables
To run this project on Render, you must configure the following in the Environment tab: | Key | Value | | :--- | :--- | | PORT | 10000 (Render default) | | MONGO_URI | mongodb+srv://<user>:<pass>@cluster.mongodb.net/clinic_cms |

2. Deployment Settings
Root Directory: direction-cms

Build Command: npm install

Start Command: node server.js

📂 Project Structure
Plaintext

Clinic_Management_System/
├── direction-cms/                # Backend (Root Directory for Render)
│   ├── models/                   # Mongoose Schemas (User, Patient, Medicine)
│   ├── routes/                   # API Endpoints (Admin, Doctor, etc.)
│   ├── server.js                 # Entry point (Express 5 logic & Static Serving)
│   └── .env                      # Local Environment Variables
├── direction-frontend/           # Frontend (Served as Static Folder)
│   ├── admin.html                # Admin Dashboard
│   ├── doctor.html               # Doctor Dashboard
│   ├── login.html                # Entry Point
│   └── style.css                 # Global Styles
└── README.md
🔧 Critical Implementation Notes (Express 5 Updates)
Named Wildcards
Because this project uses Express 5, all wildcard routes must be named.

JavaScript

// Correct Express 5 Syntax
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});
Dynamic API URLs
To ensure the frontend works both locally and on Render, all fetch calls use dynamic origins:

JavaScript

const API_URL = window.location.origin + '/api';
🛡️ Security & Initial Setup
Seeding the Admin
On the first deployment, the server.js includes an automatic seeding function.

Default Username: boss

Default Password: 123

Action: Log in immediately and create unique staff accounts via the Admin Dashboard.

Database Security
IP Whitelisting: Ensure MongoDB Atlas Network Access is set to 0.0.0.0/0 to allow Render's dynamic IPs.

Role Protection: Dashboards check localStorage for valid roles before rendering content.

📖 Staff User Manual
1. Receptionist
Entry: Register patients to generate a unique Token ID.

Exit: Process payments in the "Pending Bills" section once the doctor completes the consultation.

2. Doctor
Consult: View the live queue and access patient medical history.

Prescribe: Use "Stock Check" before submitting digital prescriptions.

3. Pharmacist
Dispense: View "Paid Prescriptions" and mark as dispensed.

Inventory: Items in RED are low stock (< 5 units). Click "+10 Units" to restock instantly.

4. Admin
Management: CRUD operations on staff accounts.

Finance: Export daily revenue to CSV for accounting.

📝 License
Distributed under the MIT License.
