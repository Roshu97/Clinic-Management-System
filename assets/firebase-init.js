// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getFirestore, collection, doc, getDoc, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4lDCtDRX02X9tdc9DXKD-x0K4O7CCEdk",
  authDomain: "clinic-management-system-1-alde.firebaseapp.com",
  databaseURL: "https://clinic-management-system-1-alde-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clinic-management-system-1-alde",
  storageBucket: "clinic-management-system-1-alde.appspot.com",
  messagingSenderId: "406549152160",
  appId: "1:406549152160:web:cb266cc28e117e455424c5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators if running locally
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  const host = location.hostname;
  connectAuthEmulator(auth, `http://${host}:9099`);
  connectFirestoreEmulator(db, host, 8080);
}

export { app, auth, db, collection, doc, getDoc };