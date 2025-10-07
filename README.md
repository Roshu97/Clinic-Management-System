# Clinic Management System

This project is a web-based Clinic Management System designed to streamline operations for both receptionists and doctors. It features patient registration, queue management, patient data viewing, and prescription management.

## Features

### Receptionist Portal
- Patient Registration: Register new patients with their details.
- Queue Management: Manage the patient queue for doctors.

### Doctor Portal
- Dashboard: Overview of daily appointments and patient queue.
- Patients: View and search patient records with paginated history.
- Queue: Manage the current patient queue, update statuses.
- Prescriptions: Manage patient prescriptions.
- Profile: Doctor's personal profile.

## Recent Enhancements

- **Comprehensive Logging:** Implemented detailed logging for all data addition functions (addPatient, addPatientHistory, addPrescription, addToken, addBill) to improve traceability and debugging.
- **Performance Optimization:** Introduced pagination for patient history data fetching, significantly improving performance and user experience when dealing with large datasets.
- **Enhanced Security:** Implemented robust Firestore security rules for role-based access control and added comprehensive client-side input validation for all "add" functions (addPatient, addPatientHistory, addPrescription, addToken) to prevent invalid data and potential vulnerabilities.
- **Improved UI/UX:** Refined the user interface and experience for both doctor and receptionist dashboards, including updated styling, improved responsiveness, and a functional hamburger menu for better navigation.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Firebase (Firestore for database, Authentication for user management)
- **Local Server:** Java Static Server (for serving static files during development)

## Setup and Installation

To get this project up and running locally, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository_url>
cd Clinec-Management-System
```

### 2. Firebase Project Setup

This project uses Firebase for its backend. You'll need to set up a Firebase project:

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click "Add project" and follow the steps to create a new project.

2.  **Add a Web App to your Firebase Project:**
    *   In your Firebase project, click the "</>" icon (Web) to add a web app.
    *   Register your app and copy the `firebaseConfig` object provided.

3.  **Update `firebase-init.js`:**
    *   Open `assets/firebase-init.js`.
    *   Replace the placeholder `firebaseConfig` object with the one you copied from the Firebase Console.

    ```javascript
    // assets/firebase-init.js
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID" // Optional
    };
    ```

4.  **Set up Firebase Admin SDK for Data Migration (Optional, for initial data import):
    *   Go to "Project settings" > "Service accounts" in your Firebase Console.
    *   Click "Generate new private key" to download a JSON file.
    *   Place this `serviceAccountKey.json` file in the `backend/` directory of your project.
    *   Install Firebase Admin SDK for Python: `pip install firebase-admin`
    *   Run the migration script (if you have existing `db.json` data):
        ```bash
        python backend/migrate_to_firestore.py
        ```

### 3. Run the Static Server

This project uses a simple Java static server to serve the frontend files.

1.  **Compile the Java Server:**
    ```bash
    javac StaticServer.java
    ```

2.  **Run the Server:**
    ```bash
    java StaticServer
    ```
    The server will typically run on `http://localhost:9003`.

## Usage

Once the server is running and Firebase is configured:

1.  Open your web browser and navigate to `http://localhost:9003/homepage.html`.
2.  You can access the Receptionist and Doctor portals from the login pages.

## Project Structure

```
Clinec-Management-System/
├── StaticServer.java             # Java static file server
├── assets/                       # Static assets (images, firebase-init.js, logger.js, firestore data handlers)
├── backend/                      # Backend related files (db.json, migration script, service account key, Firebase functions)
├── doctor/                       # Doctor portal pages and scripts
├── homepage.html                 # Main landing page
├── login/                        # Login pages for doctor and receptionist
└── receptionist/                 # Receptionist portal pages and scripts
```
