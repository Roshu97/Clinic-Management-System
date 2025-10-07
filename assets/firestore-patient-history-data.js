import { db } from './firebase-init.js';
import { collection, addDoc, getDocs, query, where, doc, getDoc, orderBy, limit, startAfter } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const patientHistoryCollection = collection(db, 'patientHistory');

export const addPatientHistory = async (historyData) => {
  // Basic validation
  if (!historyData.patientId || typeof historyData.patientId !== 'string' || historyData.patientId.trim() === '') {
    throw new Error('Patient ID is required and must be a non-empty string.');
  }
  if (!historyData.visitDate || typeof historyData.visitDate !== 'string' || historyData.visitDate.trim() === '') {
    throw new Error('Visit date is required and must be a non-empty string.');
  }
  if (!historyData.diagnosis || typeof historyData.diagnosis !== 'string' || historyData.diagnosis.trim() === '') {
    throw new Error('Diagnosis is required and must be a non-empty string.');
  }
  if (!historyData.notes || typeof historyData.notes !== 'string' || historyData.notes.trim() === '') {
    throw new Error('Notes are required and must be a non-empty string.');
  }

  try {
    const docRef = await addDoc(patientHistoryCollection, historyData);
    console.log('Patient history added with ID:', docRef.id);
    return { id: docRef.id, ...historyData };
  } catch (e) {
    console.error('Error adding patient history:', e);
    throw e;
  }
};

export const getPatientHistoryById = async (id) => {
  try {
    const docRef = doc(db, 'patientHistory', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such patient history record!');
      return null;
    }
  } catch (e) {
    console.error('Error getting patient history by ID:', e);
    throw e;
  }
};

export const getAllPatientHistory = async (limitCount = 10, lastDoc = null) => {
  try {
    let q = query(patientHistoryCollection, orderBy('timestamp', 'desc'), limit(limitCount));
    if (lastDoc) {
      q = query(patientHistoryCollection, orderBy('timestamp', 'desc'), startAfter(lastDoc), limit(limitCount));
    }
    const querySnapshot = await getDocs(q);
    const patientHistory = [];
    querySnapshot.forEach((doc) => {
      patientHistory.push({ id: doc.id, ...doc.data() });
    });
    return { patientHistory, lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] };
  } catch (e) {
    console.error('Error getting all patient history:', e);
    throw e;
  }
};