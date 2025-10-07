import { db, collection } from './firebase-init.js';
import { addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const prescriptionsCollection = collection(db, 'prescriptions');

export async function addPrescription(prescriptionData) {
  // Basic validation
  if (!prescriptionData.patientId || typeof prescriptionData.patientId !== 'string' || prescriptionData.patientId.trim() === '') {
    throw new Error('Patient ID is required and must be a non-empty string.');
  }
  if (!prescriptionData.medication || typeof prescriptionData.medication !== 'string' || prescriptionData.medication.trim() === '') {
    throw new Error('Medication is required and must be a non-empty string.');
  }
  if (!prescriptionData.dosage || typeof prescriptionData.dosage !== 'string' || prescriptionData.dosage.trim() === '') {
    throw new Error('Dosage is required and must be a non-empty string.');
  }
  if (!prescriptionData.instructions || typeof prescriptionData.instructions !== 'string' || prescriptionData.instructions.trim() === '') {
    throw new Error('Instructions are required and must be a non-empty string.');
  }

  try {
    const docRef = await addDoc(prescriptionsCollection, prescriptionData);
    console.log('Prescription added with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding prescription: ', e);
    throw e;
  }
}

export async function getPrescriptionById(prescriptionId) {
  try {
    const q = query(prescriptionsCollection, where('id', '==', prescriptionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      console.log('No prescription found with ID:', prescriptionId);
      return null;
    }
  } catch (e) {
    console.error('Error getting prescription by ID: ', e);
    throw e;
  }
}

export async function getAllPrescriptions() {
  try {
    const querySnapshot = await getDocs(prescriptionsCollection);
    const prescriptions = [];
    querySnapshot.forEach((doc) => {
      prescriptions.push({ id: doc.id, ...doc.data() });
    });
    return prescriptions;
  } catch (e) {
    console.error('Error getting all prescriptions: ', e);
    throw e;
  }
}