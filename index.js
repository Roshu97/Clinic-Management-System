import { db, doc, getDoc, auth } from './assets/firebase-init.js';
import { addPatient, getAllPatients } from './assets/firestore-patient-data.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
// Simple interactions for the ClinicFlow homepage
document.addEventListener('DOMContentLoaded', () => {
  const doctorBtn = document.getElementById('doctor-login');
  const receptionistBtn = document.getElementById('receptionist-login');

  doctorBtn?.addEventListener('click', () => {
    // Redirect to Doctor Login page
    window.location.href = '/login/doctor/';
  });

  receptionistBtn?.addEventListener('click', () => {
    // Redirect to Receptionist Login page
    window.location.href = '/login/receptionist/';
  });

  // Example of fetching data from Firestore
  const fetchData = async () => {
    try {
      const docRef = doc(db, "test", "testDoc");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  // Example of adding and fetching data from Firestore
  const exampleFirestoreInteraction = async () => {
    try {
      // Add a new patient
      const newPatientId = await addPatient({
        name: 'John Doe',
        age: 30,
        condition: 'Fever',
        doctor: 'Dr. Smith'
      });
      console.log('New patient added with ID:', newPatientId);

      // Get all patients
      const patients = await getAllPatients();
      console.log('All patients:', patients);

    } catch (error) {
      console.error('Error during Firestore interaction:', error);
    }
  };



  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      console.log("User is authenticated:", user.uid);
      exampleFirestoreInteraction();
    } else {
      // User is signed out
      console.log("User is not authenticated.");
    }
  });

  console.log("index.js is executing.");
});