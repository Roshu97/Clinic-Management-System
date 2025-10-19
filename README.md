# Clinic Management System

## Project Overview
The Clinic Management System is a web-based application designed to manage the operations of a clinic, providing separate portals for doctors and receptionists. It aims to streamline patient management, scheduling, and other administrative tasks.

## Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend/Authentication: Google Firebase (Authentication, Firestore for data storage - though not fully implemented yet)

## Project Structure
The project is organized into several key directories:
- `assets/`: Contains shared assets like `firebase-init.js` for Firebase configuration, and other static files.
- `login/`: Houses the login and registration forms for different user roles.
  - `login/doctor/`: Doctor login page.
  - `login/doctor_registration/`: Doctor registration page (HTML, CSS, JavaScript).
  - `login/receptionist/`: Receptionist login page.
  - `login/receptionist_registration/`: Receptionist registration page (HTML, CSS, JavaScript).
- `doctor/`: Contains the doctor's portal functionalities (e.g., dashboard, patients, prescriptions).
- `receptionist/`: Contains the receptionist's portal functionalities (e.g., dashboard).
- `homepage.html`, `homepage.css`, `homepage.js`: The main landing page of the application.

## Firebase Integration
Firebase is used primarily for user authentication. The `firebase-init.js` file initializes the Firebase application with the necessary configuration (API Key, Auth Domain, Project ID, etc.).
- `firebase-init.js`: Exports the initialized Firebase `app`, `auth` (authentication service), and `db` (Firestore database service) objects, making them accessible throughout the application.

## Registration Process
- Both doctor and receptionist registration forms (`login/doctor_registration/index.html` and `login/receptionist_registration/index.html`) are linked from the `homepage.html`.
- When a user submits a registration form, the associated `script.js` file (e.g., `login/doctor_registration/script.js`) handles the process.
- The `script.js` files import the `auth` object from `../../../assets/firebase-init.js` and the `createUserWithEmailAndPassword` function from the Firebase Authentication SDK.
- Upon form submission, the `createUserWithEmailAndPassword` function is called with the provided email and password. This registers the user with Firebase Authentication.
- If registration is successful, an alert confirms the success, and the user is redirected to their respective login page (e.g., `../../doctor/index.html` for doctors).
- If an error occurs during registration (e.g., invalid email, weak password, email already in use), an alert displays the Firebase error message.
- The `script.js` files are loaded as ES modules (`<script src="script.js" type="module"></script>`) to enable the use of `import` statements for Firebase SDKs.

## Portal Access (Post-Login)
- After successful registration and subsequent login (which would involve another Firebase authentication call, likely `signInWithEmailAndPassword`), users are directed to their specific portals (e.g., `doctor/dashboard/index.html` or `receptionist/dashboard/index.html`).
- Within these portals, Firebase Firestore would be used to manage and retrieve data relevant to the user\'s role (e.g., patient records for doctors, appointment schedules for receptionists).

## Basic Workflow and Execution

### 1. Firebase Project Setup
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

### 2. Run the Static Server
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

### 3. Usage
Once the server is running and Firebase is configured:

1.  Open your web browser and navigate to `http://localhost:9003/homepage.html`.
2.  You can access the Receptionist and Doctor portals from the login pages.

## GitHub Repository
This project is intended to be hosted on a public GitHub repository. Please ensure your repository is public so that the code can be reviewed. The repository link should be shared upon final submission.