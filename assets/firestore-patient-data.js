import { db, collection } from './firebase-init.js';
import { addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const patientsCollection = collection(db, 'patients');

export async function addPatient(patientData) {
  // Basic validation
  if (!patientData.name || typeof patientData.name !== 'string' || patientData.name.trim() === '') {
    throw new Error('Patient name is required and must be a non-empty string.');
  }
  if (patientData.age && (typeof patientData.age !== 'number' || patientData.age <= 0)) {
    throw new Error('Patient age must be a positive number.');
  }
  if (patientData.gender && (typeof patientData.gender !== 'string' || !['Male', 'Female', 'Other'].includes(patientData.gender))) {
    throw new Error('Patient gender must be Male, Female, or Other.');
  }

  try {
    const docRef = await addDoc(patientsCollection, patientData);
    console.log('Patient added with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding patient: ', e);
    throw e;
  }
}

export async function getPatientById(patientId) {
  try {
    const q = query(patientsCollection, where('id', '==', patientId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      console.log('No patient found with ID:', patientId);
      return null;
    }
  } catch (e) {
    console.error('Error getting patient by ID: ', e);
    throw e;
  }
}

export async function getAllPatients() {
  try {
    const querySnapshot = await getDocs(patientsCollection);
    const patients = [];
    querySnapshot.forEach((doc) => {
      patients.push({ id: doc.id, ...doc.data() });
    });
    return patients;
  } catch (e) {
    console.error('Error getting all patients: ', e);
    throw e;
  }
}