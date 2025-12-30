🏥 Direction CMS - Clinic Management System
A full-stack, role-based Clinic Management System designed to streamline patient registration, medical consultations, billing, and pharmacy inventory management.

🌟 Features
🔐 Multi-User Authentication
Admin: Manage staff accounts (CRUD), view daily financial reports, and analyze revenue trends via interactive charts.

Receptionist: Register new patients, manage the waiting queue, and process bill payments.

Doctor: View waiting list, access patient history, and issue digital prescriptions with real-time stock verification.

Pharmacist: Manage medicine inventory, track low-stock alerts, and dispense prescribed medications.

📈 Core Functionalities
Automated Workflow: Real-time status updates from Waiting → Treated → Paid → Completed.

Inventory Automation: Automatic deduction of medicine stock upon dispensing.

Financial Analytics: Daily revenue tracking and exportable CSV reports for accounting.

Data Visualization: 7-day revenue trend charts using Chart.js.

Responsive Design: Fully optimized for Desktop, Tablet, and Mobile views.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Custom Flexbox/Grid), JavaScript (ES6+).

Backend: Node.js, Express.js.

Database: MongoDB (via Mongoose).

Libraries: Chart.js (Analytics), FontAwesome (Icons), Dotenv (Environment Variables).

🚀 Getting Started
Prerequisites
Node.js (v14 or higher)

MongoDB (Local server or MongoDB Atlas)

Installation
Clone the repository

Bash

git clone https://github.com/your-username/clinic-management-system.git
cd clinic-management-system/direction-cms
Install dependencies

Bash

npm install
Configure Environment Variables Create a .env file in the direction-cms folder:

Code snippet

PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/clinic_cms
Seed the Initial Admin Run the server once to trigger the initial admin creation (default username: boss, password: 123).

Start the server

Bash

node server.js
Access the App Open your browser and visit: http://localhost:3000

📂 Project Structure
Plaintext

Clinic_Management_System/
├── direction-cms/                # Backend (Node.js/Express)
│   ├── models/                   # Mongoose Schemas (Patient, User, Medicine)
│   ├── routes/                   # API Endpoints
│   └── server.js                 # Server Entry Point
├── direction-frontend/           # Frontend (HTML/JS/CSS)
│   ├── admin/                    # Admin Dashboard & Logic
│   ├── doctor/                   # Doctor Dashboard & Logic
│   ├── pharmacy/                 # Pharmacy & Inventory Logic
│   ├── receptionist/             # Registration & Billing Logic
│   ├── login.html                # Entry Point
│   └── style.css                 # Global Responsive Styles
└── README.md
🛡️ Security & Permissions
Route Protection: Frontend checks localStorage for user roles before granting access to specific dashboards.

Data Integrity: MongoDB Schema validation ensures required fields are met before saving.

📖 Direction CMS: Staff User Manual
This manual provides a step-by-step guide for each role in the clinic to ensure a smooth patient flow from registration to discharge.

1. Receptionist: Entry & Exit
The receptionist manages the "front door" of the clinic.

Registering a New Patient
Log in and go to the Receptionist Dashboard.

Fill in the Patient Form (Name, Age, Contact, and History).

Click Add Patient.

Issue Token: A token number will appear on the screen. Write this down or tell the patient their position in the queue.

Processing Billing
Go to the Pending Bills section.

Once a patient is finished with the Doctor, their name will appear here.

Click Generate Bill ($50).

After payment is received, click Print Receipt to give a physical copy to the patient.

2. Doctor: Consultation
The Doctor focuses on medical data and prescriptions.

Seeing a Patient
Log in to the Doctor Dashboard.

View the Waiting Queue to see who is next.

Click Consult on the patient's name.

Stock Check: Use the "Check Stock" search bar to ensure the medicine you want to prescribe is currently available in the pharmacy.

Prescribe: Enter the medicines and clinical notes.

Click Submit Prescription. The patient is now automatically moved to the billing queue.

3. Pharmacist: Inventory & Dispensing
The Pharmacist ensures the patient gets the right medicine and keeps the shelves full.

Dispensing Medication
Patients who have paid their bill will appear in the Pending Prescriptions list.

Read the prescribed medication on the screen.

Once the medicine is handed to the patient, click Mark as Dispensed.

Inventory Sync: The system will automatically subtract the units from your digital inventory.

Managing Stock
Monitor the Medicine Inventory table.

Items in RED are low on stock (less than 5 units).

Click +10 Units for a quick restock, or use Add New Medicine for new shipments.

4. Admin: Oversight & Management
The Admin manages the "business" side of the clinic.

Adding/Removing Staff
Go to Staff Management.

Click + Add New Staff to create accounts for new Doctors or Receptionists.

Use the Delete button to revoke access for former employees.

Financial Reports
View the Revenue Trend chart to see the clinic's performance over the last week.

Click Export to Excel (CSV) at the end of the day to save a record for accounting.

🛠️ Troubleshooting
Login Failed: Check your caps lock and ensure the Admin has created your account in the Staff Management section.

Patient Missing: Ensure the Receptionist clicked "Add Patient" and the Doctor clicked "Submit Prescription."

Server Error: Ensure the Node.js terminal is running and "MongoDB Connected" is visible.

📝 License
Distributed under the MIT License. See LICENSE for more information.