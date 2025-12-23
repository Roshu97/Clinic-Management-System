// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getFirestore, collection, doc, getDoc, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4lDCtDRX02X9tdc9DXKD-x0K4O7CCEdk",
  authDomain: "clinic-management-system-12345.firebaseapp.com",
  databaseURL: "https://clinic-management-system-12345-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clinic-management-system-12345",
  storageBucket: "clinic-management-system-12345.appspot.com",
  messagingSenderId: "406549152160",
  appId: "1:406549152160:web:cb266cc28e117e455424c5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firestore emulator disabled due to compatibility issues
// if (location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, '127.0.0.1', 8080);
// }

export { app, auth, db, collection, doc, getDoc };